import fs from 'fs-extra';
import { showCreate, showUpdate, showError } from '../../utils/logger.util';

// export function defaultTemplate(fileNameWithExt: string, fileContent: string, hasPath = false, filePath = ''): void | Promise<void> {
//     showGenerate(fileNameWithExt);
//     checkIfDirExistElseMakeDir(hasPath, filePath);

//     const fileExists = checkExistence(`${filePath}/${fileNameWithExt}`)

//     if (!fileExists) return createFile(filePath, fileNameWithExt, fileContent);
//     return overwriteFileOrThrowError(filePath, fileNameWithExt, fileContent);
// }

function createFile(
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

// async function overwriteFileOrThrowError(filePath: string, fileNameWithExt: string, fileContent: string): Promise<void> {
//     const overwriteAnswer: Answer = await overwriteFileQuestion();
//     if (overwriteAnswer.overwrite === true) return createFile(filePath, fileNameWithExt, fileContent, true);
//     return fileAlreadyExist(fileNameWithExt);
// }

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

export function removeDirectory(path: string) {
  const dirPath = process.cwd() + path;
  fs.remove(dirPath, (err) => {
    showError(`${path} couldn't be deleted, try again`);
  });
}
