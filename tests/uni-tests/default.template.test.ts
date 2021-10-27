import fs from 'fs-extra';
import { red } from '../../node_modules/kleur';
import {
  createDirectories,
  createDirectory,
  createFile,
  createFiles,
  directoryExist,
  generateApiGateway,
  readJson,
} from '../../src/templates/default/default.template';
import {
  apiAdapterJs,
  indexJs,
  routerJs,
  serviceExampleJs,
} from '../../src/templates/filesTemplate/apiGatewayFiles';
import { initPackageJson, installPackage } from '../../src/utils/npm.util';

// createFile function
describe('Testing the createFile function', () => {
  it('should create a new file', async () => {
    const mockWriteFile = jest.spyOn(fs, 'writeFile');
    await createFile('filePath', 'fileName', 'fileContent');
    expect(mockWriteFile).toHaveBeenCalled();
    mockWriteFile.mockRestore();
  });
});

// createFiles function
describe('Testing the createFiles function', () => {
  it('should create all the files passed as args', async () => {
    const mockWriteFile = jest.spyOn(fs, 'writeFile');
    const files = [
      {
        filePath: '/tests/test-output',
        fileName: 'name',
        fileContent: 'name',
      },
      {
        filePath: 'name2',
        fileName: 'name',
        fileContent: 'name',
      },
    ];
    createFiles(files);
    expect(mockWriteFile).toHaveBeenCalledTimes(files?.length);
    mockWriteFile.mockRestore();
  });
});

// directoryExist function
describe('Testing directoryExist function', () => {
  const mockExistsSync = jest.spyOn(fs, 'existsSync');
  it('should return true if the directory exists', () => {
    mockExistsSync.mockReturnValue(true);
    expect(directoryExist('/path')).toBeTruthy();
  });

  it('should return false if the directory does not exist', () => {
    mockExistsSync.mockReturnValue(false);
    expect(directoryExist('/path')).toBeFalsy();
  });
});

// createDirectory function
describe('Testing createDirectory function', () => {
  const mockExistsSync = jest.spyOn(fs, 'existsSync');
  const mockMkdir = jest.spyOn(fs, 'mkdir');
  it("should create a new directory if one doesn't already exist", async () => {
    // set up existsSync to meet the `if` condition
    mockExistsSync.mockReturnValue(false);
    await createDirectory('/path');
    expect(mockMkdir).toHaveBeenCalled();
    mockMkdir?.mockRestore();
  });

  it('should NOT create a new directory if one already exists', async () => {
    // set up existsSync to meet the `if` condition
    await mockExistsSync.mockReturnValue(true);
    createDirectory('/path');
    expect(mockMkdir).not.toHaveBeenCalled();
    mockMkdir?.mockRestore();
  });
});

// generateApiGateway function
// describe('Testing the generateApiGateway function', () => {
//   const dirName = 'test';
//   const path = `/${dirName}/api-gateway`;
//   const name = 'test';
//   it('should create the api-gateway directory', async () => {
//     await generateApiGateway(`/${dirName}`, dirName ?? '');
//     expect(createDirectory(path)).toHaveBeenCalled();
//     expect(initPackageJson(path)).toHaveBeenCalled();
//     expect(installPackage(path, 'express', '--save')).toHaveBeenCalled();
//     expect(installPackage(path, 'body-parser', '--save')).toHaveBeenCalled();
//     expect(installPackage(path, 'axios', '--save')).toHaveBeenCalled();
//     expect(
//       createDirectories([
//         {
//           path,
//         },
//         {
//           path: `${path}/routers`,
//         },
//         {
//           path: `${path}/models`,
//         },
//         {
//           path: `${path}/controllers`,
//         },
//       ])
//     ).toHaveBeenCalled();
//     expect(
//       createFiles([
//         {
//           fileName: 'index.js',
//           filePath: path,
//           fileContent: indexJs(name),
//         },
//         {
//           fileName: 'router.js',
//           filePath: `${path}/routers`,
//           fileContent: routerJs(),
//         },
//         {
//           fileName: 'apiAdapter.js',
//           filePath: `${path}/routers`,
//           fileContent: apiAdapterJs(),
//         },
//         {
//           fileName: 'serviceExample.js',
//           filePath: `${path}/routers`,
//           fileContent: serviceExampleJs(),
//         },
//       ])
//     ).toHaveBeenCalled();
//   });
// });

// readJson function

// describe('Testing readJson function', () => {
//   describe('If the directory does not exists', () => {
//     global.console.log = jest.fn()
//     it('should show error', async () => {
//       const fileName = '/notExists';
//       const newLine = '\n';
//       const message = 'The JSON file could not be read';
//       await readJson(fileName);
//       expect(console.log).toBeCalledTimes(1)
//       expect(console.log).toHaveBeenLastCalledWith(`${red('❌🤬 ERROR: ')}${message}${newLine}`)
//     })
//   })

// })
