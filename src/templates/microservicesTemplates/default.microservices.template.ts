import { SingleBar } from 'cli-progress';
import { showError } from '../../utils/logger.util';
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
  bar: SingleBar
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
        fileContent: eslintrcjs(),
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
    await installPackage(path, 'dotenv');
    await installPackage(path, 'prettier', '-D');

    bar.update(100);

    await installPackage(path, 'rimraf', '-D');
    await installPackage(path, 'autoprefixer', '-D');
    await installPackage(path, 'eslint@7.32.0', '-D');
    await installPackage(path, 'eslint-config-avilatek@1.7.0', '-D');
    await installPackage(
      path,
      'eslint-config-avilatek-typescript@1.7.0',
      '--legacy-peer-deps'
    );

    bar.update(139);

    await installPackage(path, 'eslint-config-prettier@8.3.0', '-D');
    await installPackage(path, 'eslint-plugin-prettier@3.4.0', '-D');
    await installPackage(path, 'nodemon', '-D');
    await installPackage(path, 'docker');

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
        await initTypeScript(path);
        break;
      case 'javascript':
        break;
      default:
        showError('the selected language is not an option');
        process.exit();
    }

    bar.update(194);

    switch (orm) {
      case 'mongoose':
        await installPackage(path, 'mongoose@^5.13.3');

        switch (framework) {
          case 'express':
            await initMongooseExpress(language, path);
            break;
          case 'fastify':
            await initMongooseFastify(language, path);
            break;
          case 'koa.js':
            await initMongooseKoa(language, path);
            break;
          default:
            showError('the selected orm is not an option');
            process.exit();
        }
        break;
      case 'prisma':
        await installPackage(path, 'prisma', '--save-dev');
        await installPackage(path, '@prisma/client', '--save-dev');
        await executePackage(path, 'prisma', 'init');

        switch (framework) {
          case 'express':
            await initPrismaExpress(language, path);
            break;
          case 'fastify':
            await initPrismaFastify(language, path);
            break;
          case 'koa.js':
            await initPrismaKoa(language, path);
            break;
          default:
            showError('the selected orm is not an option');
            process.exit();
        }
        break;
      default:
        showError('the selected orm is not an option');
        process.exit();
    }
  } catch (err) {
    console.error(err);
    showError('An error has ocurred while creating the microservice');
  }
}
