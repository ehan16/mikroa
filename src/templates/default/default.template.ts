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
} from '../filesTemplate/api-gateway-files';

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
  // instala typescript y toda vaina relacionada a ts
  await installPackage(path, 'typescript', '-D');
  await Promise.all([
    installPackage(path, 'typescript', '-D'),
    installPackage(path, 'ts-node-dev', '-D'),
    installPackage(path, '@types/dotenv', '-D'),
    installPackage(path, '@types/eslint', '-D'),
    installPackage(path, '@types/prettier', '-D'),
    installPackage(path, '@types/node', '-D'),
    executePackage(path, 'tsc', '--init'),
  ]);
  await copy('/template/template.tsconfig.json', `${path}/.tsconfig.json`);
}
