import fs from 'fs-extra';
import { showCreate, showUpdate, showError } from '../../utils/logger.util';
import {
  executePackage,
  initPackageJson,
  installPackage,
} from '../../utils/npm.util';
import {
  apiAdapterJs,
  indexJs,
  routerJs,
  serviceExampleJs,
} from '../filesTemplate/apiGatewayFiles';
import { tsconfig } from '../filesTemplate/basicSetup';

// eslint-disable-next-line arrow-body-style
export const directoryExists = (path: string): boolean => {
  return fs.existsSync(process.cwd() + path);
};

export function createFile(
  filePath: string,
  fileName: string,
  fileContent: string = '',
  fileAlreadyExists = false
): void {
  const filepath = `${process.cwd()}${filePath}/${fileName}`;
  fs.writeFile(filepath, fileContent, (error: Error) => {
    if (!error && !fileAlreadyExists) return showCreate(fileName, filePath);
    if (!error && fileAlreadyExists) return showUpdate(fileName, filePath);
    return showError(error);
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

// creates a new file named `target` in case the file didn't exist
export function copy(src: string, target: string) {
  fs.copy(process.cwd() + src, process.cwd() + target, (err: Error) => {
    if (err) return showError(err);
  });
}

export async function createDirectory(path: string) {
  const dirPath = process.cwd() + path;
  try {
    if (!fs.existsSync(dirPath)) {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`File created at: ${dirPath}`);
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

export function removeDirectory(path: string) {
  const dirPath = process.cwd() + path;
  fs.remove(dirPath, (err: Error) => {
    if (err) return showError(`${path} couldn't be deleted, try again`);
  });
}

export async function readJson(fileName: string) {
  try {
    const object = await fs.readJson(`${process.cwd()}/${fileName}`);
    return object;
  } catch (err) {
    showError('The JSON file could not be read');
  }
}

// ff the directory or file doesn't exist, it creates it
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
  const path = `${filePath}/api-gateway`;
  try {
    await createDirectory(path);
    await initPackageJson(path);

    await installPackage(path, 'express', '--save');
    await installPackage(path, 'body-parser', '--save');
    await installPackage(path, 'axios', '--save');

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
    ]);

    // Correr prettier
  } catch (err) {
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
  await installPackage(path, '@typescript-eslint/eslint-plugin', '-D');
  await installPackage(path, '@typescript-eslint/parser', '-D');
  await installPackage(path, 'eslint-plugin-import@2.23.4', '-D');
  await createFile(path, 'tsconfig.json', tsconfig());
}
