/* eslint-disable @typescript-eslint/no-explicit-any */
import { SingleBar } from 'cli-progress';
import {
  readJson,
  directoryExist,
  createFile,
} from '../templates/default/default.template';
import { showError, showStart, showSuccess } from '../utils/logger.util';
import { executePrisma } from '../utils/npm.util';
import {
  mongooseJsModel,
  mongooseTsModel,
  ObjectAttribute,
} from '../templates/filesTemplate/models';

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

      const modelsConfig = await readJson(`${name}/config.json`);

      if (directoryExist(name)) {
        showStart(`to execute migrations in ${name}`);

        if (orm === 'prisma') {
          progressBar.start(100, 0, { microservice: name });
          // iterate models here

          progressBar.update(78);
          await executePrisma('migrate', `/${name}`);
          progressBar.update(82);
          await executePrisma('generate', `/${name}`);

          progressBar.update(100);
          progressBar.stop();
        } else {
          // mongoose
          for (const [model, attributes] of Object.entries(modelsConfig)) {
            let modelFile = '';
            progressBar.start(100, 30, { microservice: name });

            if (language === 'javascript') {
              progressBar.update(54);

              modelFile = mongooseJsModel(
                model,
                attributes as string | ObjectAttribute
              );
            } else {
              progressBar.update(68);

              modelFile = mongooseTsModel(
                model,
                attributes as string | ObjectAttribute
              );
            }
            progressBar.update(90);
            createFile(`/${name}/src/models`, model, modelFile);
            progressBar.update(100);
            progressBar.stop();
          }
        }
      }
      showSuccess(`${name} migration executed successfully`);
    }

    showSuccess('Migrations were successfully completed');
  } catch (err) {
    showError((err as any).message);
    process.exit(1);
  }
};
