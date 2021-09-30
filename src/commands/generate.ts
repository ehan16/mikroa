import type { Arguments, CommandBuilder } from 'yargs';
import { showSuccess } from '../utils/logger.util';

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

export const handler = (argv: Arguments<Options>): void => {
  const { microservice } = argv;
  const message = `New microservice, ${microservice || 'none'}!`;
  showSuccess(message);

  // 1. Check if microservice name was provided (for now it doesn't matter)

  // 1. In case the microservice name is passed, ask the user for language, orm, etc and then create the new microservice

  // 2. If not, then read root's config file with all the microservices config, a JSON that looks like this
  // {
  //   'microservice-name': {
  //     name: 'Microservice Name',
  //     route: './microservice-name',
  //     language: 'javascript',
  //     orm: 'mongoose',
  //     framework: 'express',
  //   },
  // };

  // 3. Check in the cache which microservices haven't been created yet

  // 4. Create the ones that are not in the cache
};
