import type { CommandBuilder } from 'yargs';

export const command: string = 'start';
export const desc: string = 'Start development server';

export const builder: CommandBuilder = {};

export const handler = (): void => {
  const message = `Starting!`;
  console.log(message);

  // 1. Execute the script that runs the microservice or its the whole file?

  // 1.1 Do we have to run the docker?
};
