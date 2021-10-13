import { showError } from '../../utils/logger.util';
import {
  executePackage,
  initPackageJson,
  installPackage,
} from '../../utils/npm.util';
import { OptionsAnswer } from '../../utils/prompt.util';
import {
  copy,
  createDirectories,
  createDirectory,
  createFiles,
  initTypeScript,
} from '../default/default.template';
import {
  initMongooseExpress,
  initMongooseFastify,
  initMongooseKoa,
  initPrismaExpress,
  initPrismaFastify,
  initPrismaKoa,
  initSequelizeExpress,
  initSequelizeFastify,
  initSequelizeKoa,
} from './initTechnologies';

export async function createMicroservice(
  microserviceName: string,
  answers: OptionsAnswer
) {
  const path = `/${microserviceName}`;
  const { framework, language, orm } = answers;
  try {
    // create the microservice root folder and init the package.json
    await createDirectory(path);
    await initPackageJson(path);
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

    // microservice-name/ ✅
    //   config.json ✅
    //   src/ ✅
    //     app.ts ✅
    //     server.ts ✅
    //     router.ts ✅
    //     controllers/ ✅
    //     models/ ✅
    //       index.ts ✅
    //   .gitignore ✅
    //   .eslintignore ✅
    //   .eslintrc.js ✅
    //   .prettierrc ✅
    //   .prettierignore ✅
    //   package.json ✅
    //   Dockerfile ✅
    //   .dockerignore ✅
    //   example.env ✅

    await Promise.all([
      copy(
        `/${microserviceName}/template/template.gitignore`,
        `${path}/.gitignore`
      ),
      copy(
        `/${microserviceName}/template/template.Dockerfile`,
        `${path}/Dockerfile`
      ),
      copy(
        `/${microserviceName}/template/template.dockerignore`,
        `${path}/.dockerignore`
      ),
      copy(
        `/${microserviceName}/template/template.env`,
        `${path}/variables.env`
      ),
      copy(
        `/${microserviceName}/template/template.eslintignore`,
        `${path}/.eslintignore`
      ),
      copy(
        `/${microserviceName}/template/template.eslintrc.js`,
        `${path}/.eslintrc.js`
      ),
      copy(
        `/${microserviceName}/template/template.prettierrc`,
        `${path}/.prettierrc`
      ),
      copy(
        `/${microserviceName}/template/template.prettierignore`,
        `${path}/.prettierignore`
      ),
    ]);

    // install base dependencies
    await installPackage(path, 'dotenv', '');
    await installPackage(path, 'prettier', '-D');
    await installPackage(path, 'autoprefixer', '-D');
    await installPackage(path, 'eslint@^7.32.0', '-D');
    console.log('eslint despues');
    await installPackage(path, 'eslint-config-avilatek@^1.7.0', '-D');
    await installPackage(path, 'eslint-config-prettier@^8.3.0', '-D');
    console.log('eslint config despues');

    // create the base files
    const extension = language === 'javascript' ? 'js' : 'ts';
    // TODO define the content of these files
    await createFiles([
      {
        fileName: 'config.json',
        filePath: `${path}`,
        fileContent: '{}',
      },
      // {
      //   fileName: `index.${extension}`,
      //   filePath: `${path}/src/routes`,
      // },
    ]);

    // ? in the case of the app and server file, output the file content with the function output file, this will depend on the chosen technologies

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

    switch (orm) {
      case 'mongoose':
        await installPackage(path, 'mongoose');
        switch (framework) {
          case 'express':
            await initMongooseExpress(language, path);
            break;
          case 'fastify':
            await initMongooseFastify(language, path);
            break;
          case 'koa.js':
            await initMongooseKoa(language);
            break;
          default:
            showError('the selected orm is not an option');
            process.exit();
        }
        break;
      case 'sequelize':
        switch (framework) {
          case 'express':
            await initSequelizeExpress(language);
            break;
          case 'fastify':
            await initSequelizeFastify(language);
            break;
          case 'koa.js':
            await initSequelizeKoa(language);
            break;
          default:
            showError('the selected orm is not an option');
            process.exit();
        }
        break;
      case 'prisma':
        await installPackage(path, 'prisma', '--save-dev');
        await executePackage(path, 'prisma', 'init');
        switch (framework) {
          case 'express':
            await initPrismaExpress(language, path);
            break;
          case 'fastify':
            await initPrismaFastify(language, path);
            break;
          case 'koa.js':
            await initPrismaKoa(language);
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
