import type { CommandBuilder } from 'yargs';

export const command = 'migrate';
export const desc =
  'Read the configuration file and migrate all the models to the database';

export const builder: CommandBuilder = {};

export const handler = (): void => {
  const message = `Migrating!`;
  console.log(message);

  // 1. Read the microservice's config file

  // 2. Create the models in the database

  // 3. Create the controllers in the database
};
