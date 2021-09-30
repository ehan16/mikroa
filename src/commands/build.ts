import type { CommandBuilder } from 'yargs';

export const command: string = 'build';
export const desc: string = 'Build a Mikroa project';

export const builder: CommandBuilder = {};

export const handler = (): void => {
  const message = `Building!`;
  console.log(message);

  // 1. Execute the command in charge of compiling the code
};
