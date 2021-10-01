import fs from 'fs-extra';
import { string } from 'yargs';
import { showCreate, showUpdate, showError } from '../../utils/logger.util';
import { initPackageJson, installPackage } from '../../utils/npm.util';
import {
  apiAdapterJs,
  indexJs,
  routerJs,
  serviceExampleJs,
} from '../filesTemplate/api-gateway-files';
import { packageJsonContent } from '../filesTemplate/package-json';

// export function defaultTemplate(fileNameWithExt: string, fileContent: string, hasPath = false, filePath = ''): void | Promise<void> {
//     showGenerate(fileNameWithExt);
//     checkIfDirExistElseMakeDir(hasPath, filePath);

//     const fileExists = checkExistence(`${filePath}/${fileNameWithExt}`)

//     if (!fileExists) return createFile(filePath, fileNameWithExt, fileContent);
//     return overwriteFileOrThrowError(filePath, fileNameWithExt, fileContent);
// }

export function createFile(
  filePath: string,
  fileName: string,
  fileContent: string,
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
    fileContent: string;
  }>
): void {
  files.forEach(async (file) => {
    await createFile(file?.filePath, file?.fileName, file?.fileContent);
  });
}

// async function overwriteFileOrThrowError(filePath: string, fileNameWithExt: string, fileContent: string): Promise<void> {
//     const overwriteAnswer: Answer = await overwriteFileQuestion();
//     if (overwriteAnswer.overwrite === true) return createFile(filePath, fileNameWithExt, fileContent, true);
//     return fileAlreadyExist(fileNameWithExt);
// }

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

export function createDirectories(directories: Array<{ path: string }>) {
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

export async function readJson(file: string) {
  try {
    const object = await fs.readJson(process.cwd() + file);
    return object;
  } catch (err) {
    showError('The JSON file could not be read');
  }
}

// ff the directory or file doesn't exist, it creates it
export function outputJson(file: string, object: unknown) {
  fs.outputJson(process.cwd() + file, object, (err: Error) => {
    if (err) showError(err);
  });
}

export async function outputJsonAsync(file: string, object: unknown) {
  try {
    await fs.outputJson(process.cwd() + file, object);
  } catch (err) {
    showError('An error has ocurred while writing the JSON file');
  }
}

export function outputFile(file: string, content: unknown) {
  fs.outputFile(process.cwd() + file, content, (err: Error) => {
    if (err) showError(err);
  });
}

export async function outputFileAsync(file: string, content: unknown) {
  try {
    await fs.outputFile(process.cwd() + file, content);
  } catch (err) {
    showError('An error has ocurred while writing the file');
  }
}

// returns a string
export async function readFile(file: string) {
  try {
    const data = await fs.readFile(process.cwd() + file, 'utf8');
    return data;
  } catch (err) {
    showError('An error has ocurred while reading the file');
  }
}

export async function generateApiGateway(
  filePath: string,
  name: string
): Promise<void> {
  const path = `${process.cwd()}${filePath}/Api-Gateway`;
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
}
