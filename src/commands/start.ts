import type { Arguments, CommandBuilder } from 'yargs';
import execa from 'execa';
import {
  readJson,
  directoryExist,
} from '../templates/default/default.template';
import {
  showError,
  showStart,
  showSuccess,
  showWarning,
} from '../utils/logger.util';

type Options = {
  name: string | undefined;
};

export const command = 'start';
export const desc = 'Start running all the microservices';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    name: { type: 'string' },
  });

export const handler = async (argv: Arguments<Options>) => {
  const { name: microserviceName } = argv;
  const message = `Starting all microservices!`;
  console.log(message);
  try {
    // 1. Check if a microservice name was provided
    if (microserviceName) {
      // 2. If a microservice was provided execute the command in charge of compiling the code
      if (directoryExist(microserviceName)) {
        showStart(`starting ${microserviceName} execution`);
        const res = await execa('npm', ['run', 'dev'], {
          cwd: `${process.cwd()}/${microserviceName}`,
        });
        if (res.failed) {
          showWarning(
            `failed to run ${microserviceName}, please check if the microservice name provided is correct`
          );
        } else {
          showSuccess(`${microserviceName} executed successfully`);
        }
      }
    } else {
      // 3. If a microservice name was no provided

      // 3.1. Read the configuration file to extract current microservices
      const configFile = await readJson('config.json');

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
          // 3.3. Execute the command in charge of compiling the code
          showStart(`starting ${name} execution`);
          if (language === 'typescript') {
            const build = await execa('npm', ['run', 'build'], {
              cwd: `${process.cwd()}/${name}`,
            });
            if (build.failed) {
              showWarning(`failed to run ${name}`);
            }
          }
          const res = await execa('npm', ['run', 'serve'], {
            cwd: `${process.cwd()}/${name}`,
          });
          if (res.failed) {
            showWarning(`failed to run ${name}`);
          } else {
            showSuccess(`${name} executed successfully`);
          }
        }
      }

      showSuccess('All microservices are running!');
    }
  } catch (err) {
    console.error(err);
    showError((err as any).message);
  }
};
