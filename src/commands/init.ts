import type { Arguments, CommandBuilder } from 'yargs';

type Options = {
  name: string | undefined;
};

export const command: string = 'init <name>';
export const desc: string = 'Init a project folder with <name>';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    name: { type: 'string' },
  });

export const handler = (argv: Arguments<Options>): void => {
  const { name } = argv;
  const message = `Initializing ${name} project!`;
  console.log(message);
};
