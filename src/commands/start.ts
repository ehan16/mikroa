import type { CommandBuilder } from 'yargs';
import execa from 'execa';
import { SingleBar } from 'cli-progress';
import {
  readJson,
  directoryExist,
} from '../templates/default/default.template';
import { showError, showWarning } from '../utils/logger.util';

export const command = 'start';
export const desc = 'Start running all the microservices';

export const builder: CommandBuilder = {};

export const handler = async () => {
  const message = `Starting all microservices!`;
  console.log(message);

  const progressBar = new SingleBar({
    format: ` {bar} | {percentage}% | {value}/{total}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  progressBar.start(50, 0);

  try {
    // 1. Read the configuration file to extract current microservices
    const configFile = await readJson('config.json');
    progressBar.update(10);

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
        const res = await execa('npm', ['run', 'dev'], {
          cwd: `${process.cwd()}/${name}`,
        });

        if (res.failed) {
          showWarning(`failed to run ${name}`);
        }
      }

      progressBar.increment(40 / Object.entries(configFile).length);
    }

    progressBar.update(50);
  } catch (err) {
    console.error(err);
    showError(
      'an error has ocurred while building, please check the Dockerfile, path or dependencies'
    );
  } finally {
    progressBar.stop();
  }
};
