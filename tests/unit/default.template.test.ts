/* eslint-disable @typescript-eslint/no-empty-function */
import fs from 'fs-extra';
import {
  createDirectory,
  createFile,
  createFiles,
  directoryExist,
  outputJsonAsync,
  readJson,
} from '../../src/templates/default/default.template';

// createFile function
describe('Testing the createFile function', () => {
  it('should create a new file', () => {
    const mockWriteFile = jest.spyOn(fs, 'writeFile');
    createFile('/tests/fixtures', 'fileName', 'fileContent');
    expect(mockWriteFile).toHaveBeenCalled();
    mockWriteFile.mockRestore();
  });

  it('should overwrite an already existing file', () => {
    const mockWriteFile = jest.spyOn(fs, 'writeFile');
    const fileExist = fs.existsSync(`${process.cwd()}/tests/fixtures/fileName`);

    createFile('/tests/fixtures', 'fileName', 'This is an update');

    expect(mockWriteFile).toHaveBeenCalled();
    mockWriteFile.mockRestore();
    expect(fileExist).toBeTruthy();
  });
});

// createFiles function
describe('Testing the createFiles function', () => {
  it('should create all the files passed as args', async () => {
    const mockWriteFile = jest.spyOn(fs, 'writeFile');
    const files = [
      {
        filePath: '/tests/fixtures',
        fileName: 'test-1',
        fileContent: 'name',
      },
      {
        filePath: '/tests/fixtures',
        fileName: 'test-2',
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

// outputJsonAsync function
describe('Testing outputJson function', () => {
  const mockOutputJson = jest.spyOn(fs, 'outputJson');
  const cache = {
    'microservice-outputJson-test': {
      language: 'typescript',
      orm: 'prisma',
      framework: 'express',
    },
  };
  it('should write over a provided json file', async () => {
    await outputJsonAsync('tests/fixtures/cache.json', cache);
    expect(mockOutputJson).toHaveBeenCalled();
    mockOutputJson.mockRestore();
  });

  it('should console error when invalid path is provided', async () => {
    const mockConsole = jest
      .spyOn(console, 'error')
      .mockImplementation((message?: any) => {});

    await outputJsonAsync('', cache);

    expect(mockConsole).toHaveBeenCalled();
    mockConsole.mockRestore();
    mockOutputJson.mockRestore();
  });
});

// readJson function
describe('Testing readJson function', () => {
  const mockReadJson = jest.spyOn(fs, 'readJson');
  it('should read the json', async () => {
    const configContent = await readJson('tests/fixtures/config.json');

    expect(configContent).not.toBeUndefined();
    expect(configContent).toBeInstanceOf(Object);
    expect(mockReadJson).toHaveBeenCalled();
    mockReadJson.mockRestore();
  });

  it('should kill process and console error when invalid json is provided', async () => {
    const mockExit = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: number) => undefined as never);
    const mockConsole = jest
      .spyOn(console, 'error')
      .mockImplementation((message?: any) => {});

    await readJson('noFile.json');

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsole).toHaveBeenCalled();
    mockExit.mockRestore();
    mockConsole.mockRestore();
    mockReadJson.mockRestore();
  });
});
