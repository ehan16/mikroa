import { showError } from '../../../../utils/logger.util';
import { createFiles } from '../../../default/default.template';
import { installPackage } from '../../../../utils/npm.util';
import {
  expressAppTs,
  fastifyMongooseAppTs,
  fastifyMongooseExampleTs,
  koaAppTs,
  koaRoutesTs,
  mongooseServerTs,
  routesIndexTs,
} from '../../../filesTemplate/technologies';

export async function initMongooseTsExpress(path: string, install: boolean) {
  try {
    await installPackage(path, '@types/express', install);
    await installPackage(path, '@types/connect-mongo', install, ['-D']);
    await createFiles([
      {
        fileName: 'app.ts',
        filePath: `${path}/src`,
        fileContent: expressAppTs(),
      },
      {
        fileName: `server.ts`,
        filePath: `${path}/src`,
        fileContent: mongooseServerTs(),
      },
      {
        fileName: `index.ts`,
        filePath: `${path}/src/routes`,
        fileContent: routesIndexTs(),
      },
    ]);
  } catch (err) {
    showError(
      'An error has ocurred while creating the mongoose-express basic files'
    );
  }
}

export async function initMongooseTsFastify(path: string, install: boolean) {
  try {
    await installPackage(path, '@types/connect-mongo', install, ['-D']);
    await createFiles([
      {
        fileName: 'app.ts',
        filePath: `${path}/src`,
        fileContent: fastifyMongooseAppTs(),
      },
      {
        fileName: 'server.ts',
        filePath: `${path}/src`,
        fileContent: mongooseServerTs(),
      },
      {
        fileName: 'users.ts',
        filePath: `${path}/src/routes`,
        fileContent: fastifyMongooseExampleTs(),
      },
    ]);
  } catch (err) {
    showError('An error has ocurred while generating the microservice');
  }
}

export async function initMongooseTsKoa(path: string, install: boolean) {
  try {
    await installPackage(path, '@types/connect-mongo', install, ['-D']);
    await installPackage(path, '@types/koa', install, ['-D']);
    await installPackage(path, '@types/koa-router', install, ['-D']);
    await installPackage(path, '@types/koa-bodyparser', install, ['-D']);

    await createFiles([
      {
        fileName: 'app.ts',
        filePath: `${path}/src`,
        fileContent: koaAppTs(),
      },
      {
        fileName: 'server.ts',
        filePath: `${path}/src`,
        fileContent: mongooseServerTs(),
      },
      {
        fileName: 'index.ts',
        filePath: `${path}/src/routes`,
        fileContent: koaRoutesTs(),
      },
    ]);
  } catch (err) {
    showError('An error has ocurred while generating the microservice');
  }
}
