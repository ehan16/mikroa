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
  kill: '<EscChar> C',
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
      if (directoryExist(`test-project/${String(microserviceName)}`)) {
        showStart(`starting ${microserviceName} execution`);
        const res = await execa('npm', ['run', 'dev'], {
          cwd: `${process.cwd()}/test-project/${microserviceName}`,
        });
        if (res.failed) {
          showWarning(
            `failed to run ${microserviceName}, please check if the microservice name provided is correct`
          );
          showError(res.stderr);
        } else {
          showSuccess(`${microserviceName} executed successfully`);
          console.log(res.stdout);
        }
      }
    } else {
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
          showStart(`starting ${name} execution`);
          if (language === 'typescript') {
            const build = await execa('npm', ['run', 'build'], {
              cwd: `${process.cwd()}/test-project/${name}`,
            });
            if (build.failed) {
              showWarning(`failed to run ${name}`);
              showError(build.stderr);
            }
          }

          execa('npm', ['run', 'start'], {
            cwd: `${process.cwd()}/test-project/${name}`,
          })
            .then((res) => {
              console.log(`${res?.stdout || ''} on ${name}`);
            })
            .catch((err) => showError(`${err?.stderr || ''} on ${name}`));
        }
      }
      showSuccess('All microservices are running!');
    }
  } catch (err) {
    console.error(err);
    showError((err as any).message);
  }
};

describe('Integration test: command start', () => {
  const mockConsole = jest
    .spyOn(console, 'error')
    .mockImplementation((message?: any) => {});

  test('running all microservices', async () => {
    const _argv = {
      _: ['start'],
      $0: 'mikroa',
    } as Arguments<Options>;

    const sendKeystrokes = async () => {
      io?.send(keys.kill);
    };

    await start(_argv);
    await setTimeout(() => sendKeystrokes().then(), 5);

    expect(mockConsole).not.toHaveBeenCalled();
    mockConsole.mockRestore();
  });

  test('run only one microservice', async () => {
    const _argv = {
      _: ['start'],
      $0: 'mikroa',
      microservice: 'epj-microservice',
    } as Arguments<Options>;

    const sendKeystrokes = async () => {
      io?.send(keys.kill);
    };

    await start(_argv);
    await setTimeout(() => sendKeystrokes().then(), 5);

    expect(mockConsole).not.toHaveBeenCalled();
    mockConsole.mockRestore();
  });
});
