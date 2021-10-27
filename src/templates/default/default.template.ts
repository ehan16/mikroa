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
  return fs.existsSync(dirPath);
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

    await installPackage(path, 'express', '--save');
    await installPackage(path, 'body-parser', '--save');
    await installPackage(path, 'axios', '--save');
    await installPackage(path, 'dotenv', '--save');
    await installPackage(path, 'nodemon', '-D');
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

export async function initTypeScript(path: string) {
  await installPackage(path, 'typescript', '-D');
  await installPackage(path, 'ts-node', '-D');
  await installPackage(path, '@types/dotenv', '-D');
  await installPackage(path, '@types/eslint', '-D');
  await installPackage(path, '@types/prettier', '-D');
  await installPackage(path, '@types/node', '-D');
  await installPackage(path, 'tslib');
  await installPackage(path, '@typescript-eslint/eslint-plugin@4.28.5', '-D');
  await installPackage(path, 'eslint-plugin-import@2.23.4', '-D');
  await createFile(path, 'tsconfig.json', tsconfig());
}
