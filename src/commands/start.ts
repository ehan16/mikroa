import type { CommandBuilder } from 'yargs';

export const command = 'start';
export const desc = 'Start running all the microservices';

export const builder: CommandBuilder = {};

export const handler = (): void => {
  const message = `Starting!`;
  console.log(message);

  // 1. Execute the script that runs the microservice or its the whole file?

  // 1.1 Do we have to run the docker?
};
