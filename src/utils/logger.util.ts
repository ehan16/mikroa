/* eslint-disable no-unused-expressions */
import { red, green, yellow, cyan } from 'kleur';
import * as figlet from 'figlet';

const newLine = '\n';

export const showTitle = (): void => {
  console.log(
    cyan(figlet.textSync('>_ | Mikroa', { horizontalLayout: 'fitted' })) +
      newLine
  );
};

export const showError = (message: string | Error): void => {
  console.error(red('❌🤬 ERROR: ') + message);
};

export const showWarning = (message: string | Error): void => {
  console.error(yellow('WARNING: ') + message);
};

export const showSuccess = (message: string): void => {
  console.log(`${green('SUCCESS: ✨') + message}✨${newLine}`);
};

export const showInfo = (message: string): void => {
  console.info(cyan('INFO: ') + message + newLine);
};

export const showGenerate = (fileName: string): void => {
  console.log(`${cyan('Creating ')} ${fileName}...`);
};

export const showCreate = (fileName: string, filePath: string): void => {
  filePath
    ? console.log(`${green('New:')} ${fileName} in ${filePath}`)
    : console.log(`${green('New:')} ${fileName}`);
};

export const showUpdate = (fileName: string, filePath: string): void => {
  filePath
    ? console.log(`${green('Update:')} ${fileName} in ${filePath}`)
    : console.log(`${green('Update:')} ${fileName}`);
};
