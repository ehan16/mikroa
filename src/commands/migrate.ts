import type { Arguments, CommandBuilder } from 'yargs';
import { red } from 'kleur';
import { SingleBar } from 'cli-progress';
import {
  readJson,
  directoryExist,
  createFile,
} from '../templates/default/default.template';
import {
  showError,
  showStart,
  showSuccess,
  showWarning,
} from '../utils/logger.util';
import { executePrisma, formatFiles } from '../utils/npm.util';
import {
  mongooseJsModel,
  mongooseTsModel,
  ObjectAttribute,
} from '../templates/filesTemplate/models';

type Options = {
  development: boolean | undefined;
};

export const command = 'migrate';
export const desc =
  'Read the configuration file and migrate all the models to the database';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.option('development', {
    alias: 'd',
    type: 'boolean',
    description: 'Run migrations for development',
  });

async function migrateMicroservice(
  config: { orm: string; language: string; framework: string },
  name: string,
  development: boolean,
  progressBar: SingleBar
) {
  try {
    const { orm, language, framework } = config as {
      language: string;
      orm: string;
      framework: string;
    };

    if (!language && !orm && !framework) {
      showError('You must execute command in root folder');
      process.exit(1);
    }

    if (directoryExist(name)) {
      const modelsConfig = await readJson(`${name}/config.json`);
      const extension = language === 'javascript' ? 'js' : 'ts';

      console.log('\n');
      showStart(`to execute migrations in ${name}`);

      if (orm.toLocaleLowerCase() === 'prisma') {
        progressBar.start(100, 78, { microservice: name });
        await executePrisma('migrate', `/${name}`, development);
        progressBar.update(82);
        await executePrisma('generate', `/${name}`);

        progressBar.update(100);
        progressBar.stop();
        showSuccess(`${name} migration executed successfully`);
      } else if (orm.toLocaleLowerCase() === 'mongoose') {
        for (const [model, attributes] of Object.entries(modelsConfig)) {
          let modelFile = '';
          progressBar.start(100, 30, { microservice: `${name} | ${model}` });

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

          if (!directoryExist(`${name}/src/models/${model}.${extension}`)) {
            createFile(
              `/${name}/src/models`,
              `${model}.${extension}`,
              modelFile
            );
          }

          progressBar.update(100);
          progressBar.stop();
        }

        await formatFiles(`/${name}`, language === 'typescript');
        console.log('\n');
        showSuccess(`${name} migration executed successfully`);
      } else {
        showWarning(`${orm} is not a valid orm or odm`);
      }
    }
  } catch (err) {
    progressBar.stop();
    console.log('\n');
    showWarning((err as any).message);
  }
}

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { development } = argv;

  const progressBar = new SingleBar({
    format: `{microservice} | {bar} | {percentage}%`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  const message = 'migrations';
  showStart(message);

  // 1. Read the microservice's config file
  const configFile = await readJson('config.json');

  // 2. Execute the migrate command
  for (const [name, config] of Object.entries(configFile)) {
    migrateMicroservice(
      config as { orm: string; language: string; framework: string },
      name,
      development || false,
      progressBar
    );
  }
};
