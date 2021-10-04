import type { Arguments, CommandBuilder } from 'yargs';
import { showError, showGenerate, showSuccess } from '../utils/logger.util';
import { promptForOptions } from '../utils/prompt.util';

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

  // 1. Check if microservice name was provided
  if (microserviceName) {
    if (
      /[^A-Za-z0-9-]+/.test(String(microserviceName)) ||
      /\s/.test(String(microserviceName))
    ) {
      showError('invalid name');
      process.exit();
    }

    const message = `${microservice || ''}`;
    showGenerate(message);

    // 1.1 In case the microservice name is passed, ask the user for language, orm, etc and then create the new microservice
    const answers = await promptForOptions();
  }

  // 2. If not, then read root's config file with all the microservices config, a JSON that looks like this
  // {
  //   'microservice-name': {
  //     route: './microservice-name',
  //     language: 'javascript',
  //     orm: 'mongoose',
  //     framework: 'express',
  //   },
  // };

  // 3. Check in the cache which microservices haven't been created yet

  // 4. Create the ones that are not in the cache
};
