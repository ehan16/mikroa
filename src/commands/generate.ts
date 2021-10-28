import type { Arguments, CommandBuilder } from 'yargs';
import { MultiBar } from 'cli-progress';
import {
  showError,
  showGenerate,
  showTitle,
  showStart,
  showWarning,
  showSuccess,
} from '../utils/logger.util';
import { promptForOptions } from '../utils/prompt.util';
import {
  readJson,
  outputJsonAsync,
} from '../templates/default/default.template';
import { createMicroservice } from '../templates/microservicesTemplates/default.microservices.template';
import { formatFiles } from '../utils/npm.util';

type Options = {
  microservice: string | undefined;
};

export const command = 'generate [microservice]';
export const desc = 'Create a new microservice';
export const aliases: string[] = ['gen'];

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    microservice: {
      type: 'string',
      describe: 'Generate a new microservice [microservice]',
    },
  });

export const handler = async (argv: Arguments<Options>) => {
  const { microservice } = argv;
  const microserviceName = microservice?.toLocaleLowerCase() ?? '';
  const microservices = [];
  let prismaMicroservice = false;

  showTitle();

  const multibar = new MultiBar({
    format: ' {bar} | {microserviceName} | {value}/{total} ',
    hideCursor: true,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  });

  try {
    const configFile = await readJson('config.json');

    // 1. Check if microservice name was provided
    if (microserviceName) {
      if (
        /[^A-Za-z0-9-]+/.test(String(microserviceName)) ||
        /\s/.test(String(microserviceName))
      ) {
        showError('invalid name');
        process.exit();
      }

      showGenerate(`${microservice || ''}`);

      // In case the microservice name is passed, ask the user for language, orm, etc
      const answers = await promptForOptions();
      microservices.push({
        name: microserviceName,
        language: answers.language,
        orm: answers.orm,
        framework: answers.framework,
      });

      // If a new microservice was created manually, append to the config
      const newConfig = {
        ...configFile,
        [microserviceName]: {
          language: answers.language,
          orm: answers.orm,
          framework: answers.framework,
        },
      };

      await outputJsonAsync('config.json', newConfig);
    } else {
      // 2. If not, then read root's config file with all the microservices config, push the object into the microservices array
      showStart('to read the configuration file');
      for (const [name, config] of Object.entries(configFile)) {
        const { language, orm, framework } = config as {
          language: string;
          orm: string;
          framework: string;
        };

        microservices.push({
          name,
          language,
          orm,
          framework,
        });
      }
    }

    // 3. Check in the cache which microservices haven't been created yet and filter them out
    showStart('to read the cache');
    let cache = await readJson('cache.json');
    const cacheLength = Object.keys(cache).length;
    let dockerPort = 3001 + cacheLength;

    const _microservices = microservices.filter(
      (m) => !Object.keys(cache).includes(m.name)
    );

    if (_microservices?.length === 0) {
      showWarning(
        'there is no new microservices to generate or an already created microservice was passed'
      );
      process.exit();
    }

    // 4. Create the ones that are not in the cache
    showGenerate('microservices');

    // multibar.bars[0].update(20);

    for (const { framework, language, name, orm } of _microservices) {
      const bar = multibar.create(300, 0, { microserviceName: name });
      if (orm === 'prisma') prismaMicroservice = true;

      await createMicroservice(
        name,
        { language, orm, framework },
        dockerPort,
        bar
      );
      dockerPort += 1;

      bar.update(289);

      // 5. Once it have been created, append the new microservice to the cache
      cache = {
        ...cache,
        [name]: {
          language,
          orm,
          framework,
        },
      };

      bar.update(296);

      // 6. format all the files
      await formatFiles(`/${name}`, language === 'typescript');
      bar.update(300);
    }

    // 7. Write the new cache file
    await outputJsonAsync('cache.json', cache);

    // 8. Format
    await formatFiles('');
    multibar.stop();
    showSuccess('The microservices have been successfully created');

    if (prismaMicroservice) {
      showWarning(
        'For Prisma and MongoDB to work, Prisma Schema and Client have to be modified accordingly'
      );
    }
  } catch (e) {
    multibar.stop();
    showError('An error has ocurred while creating the microservice');
    process.exit();
  }
};
