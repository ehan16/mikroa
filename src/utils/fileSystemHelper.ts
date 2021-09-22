import fs from 'fs';
import { showError } from './logger.util';

export function createDirectory(path: string) {
  console.log('cwd', process.cwd());
  const dirPath = process.cwd() + path;

  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (err) {
    showError('An error has ocurred while creating the directory');
  }
}

export function removeDirectory(path: string) {
  try {
    fs.rmdirSync(path, { recursive: true });
    console.log(`${path} is deleted!`);
  } catch (err) {
    showError(`${path} couldn't be deleted, try again`);
  }
}
