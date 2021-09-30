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
  // console.log(upper ? greeting.toUpperCase() : greeting);
  showSuccess(message);
};

// yargs
//     .command(['generate [microservice]', 'gen'], 'Generate a new microservice')
//     .example(
//       'mikroa generate my-microservice',
//       'Generate a new microservice `my-microservice`'
//     );
