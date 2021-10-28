/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  directoryExist,
  readJson,
} from '../../src/templates/default/default.template';
import { showError, showSuccess } from '../../src/utils/logger.util';
import { executePrisma } from '../../src/utils/npm.util';

jest.setTimeout(300000);

const migrate = async () => {
  try {
    const configFile = await readJson('test-project/config.json');

    for (const [name, config] of Object.entries(configFile)) {
      const { orm, language, framework } = config as {
        language: string;
        orm: string;
        framework: string;
      };

      if (!language && !orm && !framework) {
        showError('You must execute command in root folder');
        process.exit(1);
      }

      if (orm === 'prisma' && directoryExist(name)) {
        await executePrisma('migrate', `/test-project/${name}`);
        await executePrisma('generate', `/test-project/${name}`);
      }
    }

    showSuccess('Migrations were successfully completed');
  } catch (err) {
    showError((err as any).message);
    process.exit(1);
  }
};

describe('Integration test: command migrate', () => {
  const mockConsole = jest
    .spyOn(console, 'error')
    .mockImplementation((message?: any) => {});
  const mockExit = jest
    .spyOn(process, 'exit')
    .mockImplementation((code?: number) => undefined as never);

  test('migrating all microservices have to be successful', async () => {
    await migrate();

    expect(mockConsole).not.toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
    mockExit.mockRestore();
    mockConsole.mockRestore();
  });
});
