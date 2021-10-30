import fs from 'fs-extra';
import { SingleBar } from 'cli-progress';
import { showError } from '../../utils/logger.util';
import { installPackage } from '../../utils/npm.util';
import {
  apiAdapterJs,
  indexJs,
  routerJs,
  serviceExampleJs,
  initPackage,
} from '../filesTemplate/apiGatewayFiles';
import {
  tsconfig,
  env,
  dockerfile,
  dockerignore,
  gitignore,
} from '../filesTemplate/basicSetup';

export function createFile(
  filePath: string,
  fileName: string,
  fileContent: string = ''
): void {
  const filepath = `${process.cwd()}${filePath}/${fileName}`;
  fs.writeFile(filepath, fileContent, (error: Error) => {
    if (error) return showError(error);
  });
}

export function createFiles(
  files: Array<{
    filePath: string;
    fileName: string;
    fileContent?: string;
  }>
): void {
  files.forEach(async (file) => {
    await createFile(file?.filePath, file?.fileName, file?.fileContent ?? '');
  });
}

export function directoryExist(path: string) {
  const dirPath = `${process.cwd()}/${path}`;
  if (fs.existsSync(dirPath)) {
    return true;
  }
  return false;
}

export async function createDirectory(path: string) {
  const dirPath = process.cwd() + path;
  try {
    if (!fs.existsSync(dirPath)) {
      await fs.mkdir(dirPath, { recursive: true });
    }
  } catch (err) {
    showError('An error has ocurred while creating the directory');
  }
}

export function createDirectories(directories: { path: string }[]) {
  directories?.forEach(async (directory) => {
    await createDirectory(directory?.path);
  });
}

export async function readJson(fileName: string) {
  try {
    const object = await fs.readJson(`${process.cwd()}/${fileName}`);
    return object;
  } catch (err) {
    showError('The JSON file could not be read');
    process.exit(1);
  }
}

export function outputJson(fileName: string, object: unknown) {
  fs.outputJson(`${process.cwd()}/${fileName}`, object, (err: Error) => {
    if (err) showError(err);
  });
}

export async function outputJsonAsync(fileName: string, object: unknown) {
  try {
    await fs.outputJson(`${process.cwd()}/${fileName}`, object);
  } catch (err) {
    showError('An error has ocurred while writing the JSON file');
  }
}

export function outputFile(fileName: string, content: unknown) {
  fs.outputFile(`${process.cwd()}/${fileName}`, content, (err: Error) => {
    if (err) showError(err);
  });
}

export async function outputFileAsync(fileName: string, content: unknown) {
  try {
    await fs.outputFile(`${process.cwd()}/${fileName}`, content);
  } catch (err) {
    showError('An error has ocurred while writing the file');
  }
}

// returns a string
export async function readFile(fileName: string) {
  try {
    const data = await fs.readFile(`${process.cwd()}/${fileName}`, 'utf8');
    return data;
  } catch (err) {
    showError('An error has ocurred while reading the file');
  }
}

export async function generateApiGateway(
  filePath: string,
  name: string
): Promise<void> {
  const progressBar = new SingleBar({
    format: `API Gateway | {bar} | {percentage}% | {value}/{total}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  progressBar.start(150, 0);
  const path = `${filePath}/api-gateway`;

  try {
    await createDirectory(path);
    await createFile(path, 'package.json', initPackage());

    progressBar.update(10);

    await installPackage(path, 'express');
    await installPackage(path, 'body-parser');
    await installPackage(path, 'axios');
    await installPackage(path, 'dotenv');
    await installPackage(path, 'nodemon', true, ['-D']);
    await installPackage(path, 'docker');

    progressBar.update(54);

    await createDirectories([
      {
        path,
      },
      {
        path: `${path}/routers`,
      },
      {
        path: `${path}/models`,
      },
      {
        path: `${path}/controllers`,
      },
    ]);

    progressBar.update(87);

    await createFiles([
      {
        fileName: 'index.js',
        filePath: path,
        fileContent: indexJs(name),
      },
      {
        fileName: 'router.js',
        filePath: `${path}/routers`,
        fileContent: routerJs(),
      },
      {
        fileName: 'apiAdapter.js',
        filePath: `${path}/routers`,
        fileContent: apiAdapterJs(),
      },
      {
        fileName: 'serviceExample.js',
        filePath: `${path}/routers`,
        fileContent: serviceExampleJs(),
      },
      {
        fileName: '.env',
        filePath: path,
        fileContent: env(),
      },
      {
        fileName: '.dockerignore',
        filePath: path,
        fileContent: dockerignore(),
      },
      {
        fileName: 'Dockerfile',
        filePath: path,
        fileContent: dockerfile('3000'),
      },
      {
        fileName: '.dockerignore',
        filePath: path,
        fileContent: dockerignore(),
      },
      {
        fileName: '.gitignore',
        filePath: path,
        fileContent: gitignore(),
      },
    ]);

    progressBar.update(150);
    progressBar.stop();
  } catch (err) {
    progressBar.stop();
    showError('An error has ocurred while creating the API Gateway');
  }
}

export async function initTypeScript(path: string, install: boolean) {
  await installPackage(path, 'typescript', install, ['-D']);
  await installPackage(path, 'ts-node', install, ['-D']);
  await installPackage(path, '@types/dotenv', install, ['-D']);
  await installPackage(path, '@types/eslint', install, ['-D']);
  await installPackage(path, '@types/prettier', install, ['-D']);
  await installPackage(path, '@types/node', install, ['-D']);
  await installPackage(path, 'tslib', install);
  await installPackage(
    path,
    '@typescript-eslint/eslint-plugin@^5.1.0',
    install,
    ['-D']
  );
  await installPackage(path, '@typescript-eslint/parser@^5.1.0', install, [
    '-D',
  ]);
  await installPackage(path, 'eslint-plugin-import@^2.25.2', install, ['-D']);
  await installPackage(
    path,
    'eslint-config-avilatek-typescript@^1.7.0',
    install,
    ['-D']
  );
  await createFile(path, 'tsconfig.json', tsconfig());
}
