/* eslint-disable @typescript-eslint/no-explicit-any */
import { SingleBar } from 'cli-progress';
import {
  readJson,
  directoryExist,
} from '../templates/default/default.template';
import { showError, showStart } from '../utils/logger.util';
import { executePrisma } from '../utils/npm.util';

export const command = 'migrate';
export const desc =
  'Read the configuration file and migrate all the models to the database';

export const handler = async (): Promise<void> => {
  const progressBar = new SingleBar({
    format: `Migration | {bar} | {percentage}% | {value}/{total}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  try {
    const message = 'migration!';
    showStart(message);

    progressBar.start(50, 0);

    // 1. Read the microservice's config file
    const configFile = await readJson('config.json');
    progressBar.update(10);

    // 2. Execute the migrate command
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
        // showStart(`executing migration in ${name}`);
        await executePrisma('migrate', `/${name}`);
        await executePrisma('generate', `/${name}`);
        // showSuccess(`${name} migration executed successfully`);
      }

      progressBar.increment(40 / Object.entries(configFile).length);
    }

    progressBar.update(50);
  } catch (err) {
    showError((err as any).message);
    process.exit(1);
  } finally {
    progressBar.stop();
  }
};
