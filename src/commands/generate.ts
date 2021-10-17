import type { Arguments, CommandBuilder } from 'yargs';
import {
  showError,
  showGenerate,
  showTitle,
  showStart,
  showWarning,
} from '../utils/logger.util';
import { promptForOptions } from '../utils/prompt.util';
import { readJson, outputJson } from '../templates/default/default.template';
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

  showTitle();

  try {
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

      // 1.1 In case the microservice name is passed, ask the user for language, orm, etc
      const answers = await promptForOptions();
      microservices.push({
        name: microserviceName,
        language: answers.language,
        orm: answers.orm,
        framework: answers.framework,
      });
    } else {
      // 2. If not, then read root's config file with all the microservices config, push the object into the microservices array
      // {
      //   'microservice-name': {
      //     language: 'javascript',
      //     orm: 'mongoose',
      //     framework: 'express',
      //   },
      // };
      showStart('to read the configuration file');
      const configFile = await readJson('config.json');
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
    const cacheMicroservices = Object.keys(cache);
    const _microservices = microservices.filter(
      (m) => !cacheMicroservices.includes(m.name)
    );

    if (_microservices?.length === 0) {
      showWarning(
        'there is no new microservices to generate or you passed an already created microservice'
      );
    }

    // 4. Create the ones that are not in the cache
    for (const { framework, language, name, orm } of _microservices) {
      showGenerate(`${name} microservice`);
      await createMicroservice(name, { language, orm, framework });

      // 5. Once the microservice have been created, append the new microservice to the cache
      cache = {
        ...cache,
        [name]: {
          language,
          orm,
          framework,
        },
      };

      // 6. format all the files
      await formatFiles(`/${name}`, language === 'typescript');
    }

    // 7. Write the new cache file
    await outputJson('cache.json', cache);
  } catch (e) {
    showError('An error has ocurred while creating the microservice');
    process.exit();
  }
};
