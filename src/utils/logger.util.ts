import { red, green, cyan } from 'kleur';
import * as figlet from 'figlet';

// import { ConsoleMessage } from '../models/console-message';

//!! SET THE CONSOLE MESSAGES

const newLine = '\n';

export const showTitleAndBanner = (): void => {
    console.log(cyan(figlet.textSync('here goes the message', { horizontalLayout: 'full' })));
    console.info(cyan('here goes the message'));
}

export const showError = (message: string | Error): void => {
    console.error(red('here goes the message') + message);
}

export const showSuccess = (message: string): void => {
    console.log(green('here goes the message') + message + newLine);
}

export const showInfo = (message: string): void => {
    console.info(cyan('here goes the message') + message + newLine);
}

export const showGenerate = (fileName: string): void => {
    console.log(cyan('here goes the message') + `${fileName}...`);
}

export const showCreate = (fileName: string, filePath: string): void => {
    filePath
    ? console.log(green('here goes the message') + `${fileName} in ${filePath}`)
    : console.log(green('here goes the message') + `${fileName}`);
}

export const showUpdate = (fileName: string, filePath: string): void => {
    filePath
    ? console.log(green('here goes the message') + `${fileName} in ${filePath}`)
    : console.log(green('here goes the message') + `${fileName}`);
}