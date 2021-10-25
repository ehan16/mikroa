import type { CommandBuilder } from 'yargs';
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

export const command = 'start';
export const desc = 'Start running all the microservices';

export const builder: CommandBuilder = {};

export const handler = async () => {
  const message = `Starting all microservices!`;
  console.log(message);

  try {
    // 1. Read the configuration file to extract current microservices
    const configFile = await readJson('config.json');

    // 2. Iterate over the microservices
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
        // 3. Execute the command in charge of compiling the code
        showStart(`starting ${name} execution`);
        const res = await execa('npm', ['run', 'dev'], {
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
  } catch (err) {
    console.error(err);
    showError((err as any).message);
  }
};
