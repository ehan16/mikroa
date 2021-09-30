import type { Arguments, CommandBuilder } from 'yargs';
import { showSuccess } from '../utils/logger.util';

type Options = {
  microservice: string | undefined;
};

export const command: string = 'generate';
export const desc: string = 'Generate a new microservice';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    microservice: {
      type: 'string',
      desc: 'Generate a new microservice <microservice>',
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
