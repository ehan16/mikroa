/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import fs from 'fs-extra';
import execa from 'execa';
import {
  directoryExist,
  readJson,
} from '../../src/templates/default/default.template';
import {
  showStart,
  showWarning,
  showError,
  showSuccess,
} from '../../src/utils/logger.util';

jest.setTimeout(100000);

const build = async () => {
  try {
    const configFile = await readJson('test-project/config.json');
    for (const [name, config] of Object.entries(configFile)) {
      const { language, orm, framework } = config as {
        language: string;
        orm: string;
        framework: string;
      };

      if (!(language && orm && framework)) {
        showError('you must execute command in root folder');
        process.exit(1);
      }

      if (directoryExist(name)) {
        showStart(`building ${name} image`);
        const resBuild = await execa(
          'docker',
          ['build', '.', '-t', `${name}`],
          {
            cwd: `${process.cwd()}/test-project/${name}`,
          }
        );

        const resRun = await execa('docker', ['run', '-d', `${name}`], {
          cwd: `${process.cwd()}/test-project${name}`,
        });

        if (resBuild.failed || resRun.failed) {
          showWarning(`failed to generate ${name} Docker container`);
        } else {
          showSuccess(`${name} container started successfully`);
        }
      }
    }
    showSuccess('Build was successful');
  } catch (err) {
    showError((err as any).message);
    process.exit(1);
  }
};

describe('Integration test: command build', () => {
  const mockConsole = jest
    .spyOn(console, 'error')
    .mockImplementation((message?: any) => {});
  const mockExit = jest
    .spyOn(process, 'exit')
    .mockImplementation((code?: number) => undefined as never);

  test('building all microservices images', async () => {
    await build();

    const dockerCompose = fs.existsSync(
      `${process.cwd()}/test-project/docker-compose.yml`
    );

    expect(dockerCompose).toBeTruthy();
    expect(mockConsole).not.toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
    mockExit.mockRestore();
    mockConsole.mockRestore();
  });
});
