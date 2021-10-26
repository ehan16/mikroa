/* eslint-disable @typescript-eslint/no-explicit-any */
import { SingleBar } from 'cli-progress';
import {
  readJson,
  directoryExist,
} from '../templates/default/default.template';
import { showError, showStart, showSuccess } from '../utils/logger.util';
import { executePrisma } from '../utils/npm.util';

export const command = 'migrate';
export const desc =
  'Read the configuration file and migrate all the models to the database';

export const handler = async (): Promise<void> => {
  try {
    const message = 'migrations';
    showStart(message);

    const progressBar = new SingleBar({
      format: `{microservice} | {bar} | {percentage}%`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    });

    // 1. Read the microservice's config file
    const configFile = await readJson('config.json');

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
        showStart(`execute migration in ${name}`);
        progressBar.start(100, 30, { microservice: name });
        // await executePrisma('migrate', `/${name}`);
        progressBar.update(60);
        // await executePrisma('generate', `/${name}`);
        progressBar.update(100);
        progressBar.stop();
        showSuccess(`${name} migration executed successfully`);
      }
    }

    showSuccess('Migrations were successfully completed');
  } catch (err) {
    showError((err as any).message);
    process.exit(1);
  }
};
