import type { Arguments, CommandBuilder } from 'yargs';
import {
  showError,
  showGenerate,
  showTitle,
  showStart,
} from '../utils/logger.util';
import { promptForOptions } from '../utils/prompt.util';
import { readJson, outputJson } from '../templates/default/default.template';
import { createMicroservice } from '../templates/microservicesTemplates/default.microservices.templates';

type Options = {
  microservice: string | undefined;
};

export const command: string = 'generate [microservice]';
export const desc: string = 'Create a new microservice';
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
      console.log('CONFIG FILE', configFile);
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
      console.log(configFile);
    }

    // 3. Check in the cache which microservices haven't been created yet and filter them out
    showStart('to read the cache');
    let cache = await readJson('cache.json');
    console.log('CACHE FILE', cache);
    const cacheMicroservices = Object.keys(cache);
    const _microservices = microservices.filter(
      (m) => !cacheMicroservices.includes(m.name)
    );

    // 4. Create the ones that are not in the cache
    _microservices.forEach(({ framework, language, name, orm }) => {
      showGenerate(`${name} microservice`);
      console.log('Hey');
      createMicroservice(name, { language, orm, framework });

      // 5. Once the microservice have been created, append the new microservice to the cache
      cache = {
        ...cache,
        [name]: {
          language,
          orm,
          framework,
        },
      };
    });

    console.log('new cache', cache);

    // 6. Write the new cache file
    outputJson('cache.json', cache);
  } catch (e) {
    showError('An error has ocurred while creating the microservice');
    process.exit();
  }
};
