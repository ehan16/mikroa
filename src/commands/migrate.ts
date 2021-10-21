/* eslint-disable @typescript-eslint/no-explicit-any */
import { readJson } from '../templates/default/default.template';
import { showError, showStart, showSuccess } from '../utils/logger.util';
import { executePrisma } from '../utils/npm.util';

export const command = 'migrate';
export const desc =
  'Read the configuration file and migrate all the models to the database';

export const handler = async (): Promise<void> => {
  try {
    const message = 'migration!';
    showStart(message);

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
      if (orm === 'prisma') {
        showStart(`executing migration in ${name}`);
        await executePrisma('migrate', `/${name}`);
        await executePrisma('generate', `/${name}`);
        showSuccess(`${name} migration executed successfully`);
      }
    }
  } catch (err) {
    showError((err as any).message);
  }
};
