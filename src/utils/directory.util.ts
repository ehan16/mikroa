import fs from 'fs';
import { showError } from './logger.util';

export function createDirectory(path: string) {
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
  const dirPath = process.cwd() + path;
  fs.rm(dirPath, { recursive: true }, (err) => {
    if (err) showError(`${path} couldn't be deleted, try again`);
  });
}
