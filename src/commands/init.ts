import type { Arguments, CommandBuilder } from 'yargs';
import { createDirectory } from '../templates/default/default.template';
import { showTitle } from '../utils/logger.util';

type Options = {
  name: string | undefined;
};

export const command: string = 'init <name>';
export const aliases: string[] = ['i', 'initialize'];
export const desc: string =
  'Init <name> project folder with the config file and api getway';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    name: { type: 'string' },
  });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { name } = argv;
  const message = `Initializing ${name} project!`;
  console.log(message);

  showTitle();

  // 1. Ask git repository?

  // 2. Receive the new directory name and generate it

  // 3. Create the project directory
  await createDirectory(name ?? '');
  console.log('success');
  // 4. Generate the config file

  // 5. Generate the api gateway

  // 6. Generate cache file
};
