import type { CommandBuilder } from 'yargs';

export const command: string = 'start';
export const desc: string = 'Start development server';

export const builder: CommandBuilder = {};

export const handler = (): void => {
  const message = `Starting!`;
  console.log(message);
};
