/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Arguments } from 'yargs';
import { MockSTDIN, stdin } from 'mock-stdin';
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

const keys = {
  up: '\x1B\x5B\x41',
  down: '\x1B\x5B\x42',
  enter: '\x0D',
  space: '\x20',
  kill: '\x03',
};

type Options = {
  microservice: string | undefined;
};

// Mock stdin so we can send messages to the CLIs
let io: MockSTDIN | null = null;
beforeAll(() => (io = stdin()));
afterAll(() => io?.restore());

jest.setTimeout(30000);

const start = async (argv: Arguments<Options>) => {
  const { microservice: microserviceName } = argv;
  try {
    if (microserviceName) {
      if (directoryExist(String(microserviceName))) {
        showStart(`starting ${microserviceName} execution`);
        const res = await execa('npm', ['run', 'dev'], {
          cwd: `${process.cwd()}/test-project/${microserviceName}`,
        });
        if (res.failed) {
          showError(
            `failed to run ${microserviceName}, please check if the microservice name provided is correct and the script <npm run dev> exists`
          );
        } else {
          showSuccess(`${microserviceName} executed successfully`);
        }
      }
    } else {
      const configFile = await readJson('test-project/config.json');
      const npmToRun: string[] = [];

      showStart(`to build the command for execution`);

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

        if (directoryExist(`test-project/${name}`)) {
          npmToRun.push(`"npm run dev --prefix ./${name}"`);
        }
      }

      showSuccess(`starting to run all microservices`);
      const res = await execa(
        'npx',
        ['concurrently', '--kill-others', ...npmToRun],
        {
          cwd: `${process.cwd()}/test-project`,
        }
      );

      if (res.failed) {
        showError(
          `failed to run the microservices, please check if the script <npm run dev> exists or the configurations files are correct`
        );
      } else {
        showSuccess('All microservices are running!');
      }
    }
  } catch (err) {
    console.error(err);
    showError((err as any).message);
    process.exit(1);
  }
};

describe('Integration test: command start', () => {
  const mockConsole = jest
    .spyOn(console, 'error')
    .mockImplementation((message?: any) => {});
  const mockExit = jest
    .spyOn(process, 'exit')
    .mockImplementation((code?: number) => undefined as never);

  test('running all microservices have to be successful', async () => {
    const _argv = {
      _: ['start'],
      $0: 'mikroa',
    } as Arguments<Options>;

    const sendKeystrokes = async () => {
      io?.send(keys.kill);
    };

    setTimeout(() => process.kill, 10);
    await start(_argv);

    expect(mockConsole).not.toHaveBeenCalled();
    // expect(mockExit).toHaveBeenCalled();
    // mockExit.mockRestore();
    mockConsole.mockRestore();
  });
});
