import type { Arguments, CommandBuilder } from 'yargs';
import execa from 'execa';
import { SingleBar } from 'cli-progress';
import {
  readJson,
  directoryExist,
} from '../templates/default/default.template';
import {
  showError,
  showInfo,
  showStart,
  showSuccess,
  showWarning,
} from '../utils/logger.util';

type Options = {
  microservice: string | undefined;
};

export const command = 'start [microservice]';
export const desc = 'Start running the microservices';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    microservice: { type: 'string' },
  });

export const handler = async (argv: Arguments<Options>) => {
  const { microservice: microserviceName } = argv;
  const message = `Starting microservices!`;
  console.log(message);
  try {
    // 1. Check if a microservice name was provided
    if (microserviceName) {
      // 2. If a microservice was provided execute the command in charge of compiling the code
      if (directoryExist(String(microserviceName))) {
        showStart(`starting ${microserviceName} execution`);
        const res = await execa('npm', ['run', 'dev'], {
          cwd: `${process.cwd()}/${microserviceName}`,
        });
        if (res.failed) {
          showWarning(
            `failed to run ${microserviceName}, please check if the microservice name provided is correct and the script <npm run dev> exists`
          );
          showError(res.stderr);
        } else {
          showSuccess(`${microserviceName} executed successfully`);
          console.log(res.stdout);
        }
      }
    } else {
      // 3. If a microservice name was no provided

      // 3.1. Read the configuration file to extract current microservices
      const configFile = await readJson('config.json');
      const npmToRun: string[] = [];

      showStart(`to build the command for execution`);
      const progressBar = new SingleBar({
        format: `Creating command | {bar} | {percentage}%`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      });

      progressBar.start(Object.keys(configFile).length * 10, 0);

      // 3.2. Iterate over the microservices
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
          // 3.3. Push the command into the array
          npmToRun.push(`"npm run dev --prefix ./${name}"`);
        }

        progressBar.increment(10);
      }

      progressBar.stop();

      // run the concurrent commands
      showSuccess(`starting to run all microservices`);
      const res = await execa(
        'npx',
        ['concurrently', '--kill-others', ...npmToRun],
        {
          cwd: `${process.cwd()}`,
        }
      );

      if (res.failed) {
        console.log(res.stderr);
        showError(`EXIT CODE ${res.exitCode}`);
        showWarning(
          `failed to run the microservices, please check if the script <npm run dev> exists or the configurations files are correct`
        );
        process.exit(1);
      } else if (res.isCanceled || res.killed) {
        showInfo('the process was killed');
        process.exit(1);
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
