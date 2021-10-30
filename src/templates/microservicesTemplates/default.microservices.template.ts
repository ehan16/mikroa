import { SingleBar } from 'cli-progress';
import { showError, showWarning } from '../../utils/logger.util';
import { executePackage, installPackage } from '../../utils/npm.util';
import { OptionsAnswer } from '../../utils/prompt.util';
import {
  createDirectories,
  createDirectory,
  createFiles,
  initTypeScript,
  createFile,
} from '../default/default.template';
import {
  initMongooseExpress,
  initMongooseFastify,
  initMongooseKoa,
  initPrismaExpress,
  initPrismaFastify,
  initPrismaKoa,
} from './initTechnologies';
import {
  dockerfile,
  dockerignore,
  env,
  eslintignore,
  eslintrcjs,
  gitignore,
  prettierignore,
  prettierrc,
} from '../filesTemplate/basicSetup';
import packageJson from '../filesTemplate/packageJson';

export async function createMicroservice(
  microserviceName: string,
  answers: OptionsAnswer,
  dockerPort: number,
  bar: SingleBar,
  dependencies: boolean = true
) {
  const path = `/${microserviceName}`;
  const { framework, language, orm } = answers;

  try {
    // create the microservice root folder and init the package.json
    await createDirectory(path);
    await createFile(
      path,
      'package.json',
      packageJson(microserviceName, language, orm)
    );

    bar.update(10);

    // create all the folders
    await createDirectories([
      {
        path: `${path}/src`,
      },
      {
        path: `${path}/src/controllers`,
      },
      {
        path: `${path}/src/models`,
      },
      {
        path: `${path}/src/routes`,
      },
    ]);

    bar.update(34);

    await createFiles([
      {
        fileName: '.gitignore',
        filePath: `${path}`,
        fileContent: gitignore(),
      },
      {
        fileName: 'Dockerfile',
        filePath: `${path}`,
        fileContent: dockerfile(String(dockerPort ?? 3001)),
      },
      {
        fileName: '.dockerignore',
        filePath: `${path}`,
        fileContent: dockerignore(),
      },
      {
        fileName: '.env',
        filePath: `${path}`,
        fileContent: env(),
      },
      {
        fileName: '.eslintignore',
        filePath: `${path}`,
        fileContent: eslintignore(),
      },
      {
        fileName: '.eslintrc.js',
        filePath: `${path}`,
        fileContent: eslintrcjs(language),
      },
      {
        fileName: '.prettierrc',
        filePath: `${path}`,
        fileContent: prettierrc(),
      },
      {
        fileName: '.prettierignore',
        filePath: `${path}`,
        fileContent: prettierignore(),
      },
    ]);

    bar.update(70);

    // install base dependencies
    await installPackage(path, 'dotenv', dependencies);
    await installPackage(path, 'prettier@^2.4.1', dependencies, ['-D']);

    bar.update(100);

    await installPackage(path, 'rimraf', dependencies, ['-D']);
    await installPackage(path, 'autoprefixer', dependencies, ['-D']);
    await installPackage(path, 'eslint@^7.5.0', dependencies, ['-D']);
    await installPackage(path, 'eslint-config-avilatek@^1.7.0', dependencies, [
      '-D',
    ]);

    bar.update(139);

    await installPackage(path, 'eslint-config-prettier@^8.3.0', dependencies, [
      '-D',
    ]);
    await installPackage(path, 'eslint-plugin-prettier@^4.0.0', dependencies, [
      '-D',
    ]);
    await installPackage(path, 'nodemon', dependencies, ['-D']);
    await installPackage(path, 'docker', dependencies);
    await installPackage(path, 'concurrently', dependencies);

    bar.update(170);

    // create the base files
    await createFiles([
      {
        fileName: 'config.json',
        filePath: `${path}`,
        fileContent: '{}',
      },
    ]);

    bar.update(176);

    // install all the dependencies and create files according to the provided answers
    switch (language) {
      case 'typescript':
        await initTypeScript(path, dependencies);
        break;
      case 'javascript':
        break;
      default:
        showError('the selected language is not an option');
        process.exit(1);
    }

    bar.update(194);

    switch (orm) {
      case 'mongoose':
        await installPackage(path, 'mongoose@^5.13.3', dependencies);

        switch (framework) {
          case 'express':
            await initMongooseExpress(language, path, dependencies);
            break;
          case 'fastify':
            await initMongooseFastify(language, path, dependencies);
            break;
          case 'koa.js':
            await initMongooseKoa(language, path, dependencies);
            break;
          default:
            showError('the selected orm is not an option');
            process.exit(1);
        }
        break;
      case 'prisma':
        await installPackage(path, 'prisma', dependencies, ['-D']);
        await installPackage(path, '@prisma/client', dependencies, ['-D']);
        await executePackage(path, 'prisma', 'init');

        switch (framework) {
          case 'express':
            await initPrismaExpress(language, path, dependencies);
            break;
          case 'fastify':
            await initPrismaFastify(language, path, dependencies);
            break;
          case 'koa.js':
            await initPrismaKoa(language, path, dependencies);
            break;
          default:
            showError('the selected orm is not an option');
            process.exit(1);
        }
        break;
      default:
        showError('the selected orm is not an option');
        process.exit(1);
    }
  } catch (err) {
    console.error(err);
    showWarning('An error has ocurred while creating the microservice');
  }
}
