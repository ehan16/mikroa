/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Arguments } from 'yargs';
import { MockSTDIN, stdin } from 'mock-stdin';
import concurrently from 'concurrently';
import execa from 'execa';
import {
  directoryExist,
  readJson,
} from '../../src/templates/default/default.template';
import { showStart, showError, showSuccess } from '../../src/utils/logger.util';

type Options = {
  microservice: string | undefined;
};

// Mock stdin so we can send messages to the CLIs
let io: MockSTDIN | null = null;
beforeAll(() => (io = stdin()));
afterAll(() => io?.restore());

jest.setTimeout(100000);

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

      concurrently(npmToRun, {
        prefix: 'name',
        killOthers: ['failure', 'success'],
        restartTries: 3,
        cwd: `${process.cwd()}/test-project`,
      }).then(
        function onSuccess(exitInfo) {
          // This code is necessary to make sure the parent terminates
          // when the application is closed successfully.
          console.log('Success');
          process.exit();
        },
        function onFailure(exitInfo) {
          // This code is necessary to make sure the parent terminates
          // when the application is closed because of a failure.
          console.error('Error');
          process.exit(1);
        }
      );
    }
  } catch (err) {
    console.error(err);
    showError((err as any).message);
    process.exit(1);
  }
};

describe('Integration test: command start', () => {
  // const mockExit = jest
  //   .spyOn(process, 'exit')
  //   .mockImplementation((code?: number) => undefined as never);

  const mockConsole = jest
    .spyOn(console, 'log')
    .mockImplementation((message?: any) => {});

  test('running all microservices have to be successful', async () => {
    const _argv = {
      _: ['start'],
      $0: 'mikroa',
    } as Arguments<Options>;

    // setTimeout(() => process.exit(0), 60000);
    // setTimeout(function () {
    //   console.log('Exiting...');
    //   // process.kill(process.pid, 'SIGHUP');
    //   process.exit(0);
    // }, 10000);

    await start(_argv);

    // expect(mockExit).toBeCalled();
    // mockExit.mockRestore();

    expect(mockConsole).toHaveBeenCalled();
    mockConsole.mockRestore();
  });
});
