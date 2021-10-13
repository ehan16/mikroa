import { showError } from '../../../../utils/logger.util';
import { createFiles } from '../../../default/default.template';
import { installPackage } from '../../../../utils/npm.util';
import {
  expressAppTs,
  mongooseExpressServerTs,
  fastifyMongooseAppTs,
  fastifyMongooseExampleTs,
  fastifyMongooseServerTs,
  routesIndexTs,
} from '../../../filesTemplate/technologies';

export async function initMongooseTsExpress(path: string) {
  try {
    await installPackage(path, '@types/express');
    await createFiles([
      {
        fileName: 'app.ts',
        filePath: `${path}/src`,
        fileContent: expressAppTs(),
      },
      {
        fileName: `server.ts`,
        filePath: `${path}/src`,
        fileContent: mongooseExpressServerTs(),
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

export async function initMongooseTsFastify(path: string) {
  try {
    await installPackage(path, 'fastify');
    await installPackage(path, 'fastify-plugin');
    await installPackage(path, '@types/connect-mongo', '-D');

    await createFiles([
      {
        fileName: 'app.ts',
        filePath: `${path}/src`,
        fileContent: fastifyMongooseAppTs(),
      },
      {
        fileName: 'server.ts',
        filePath: `${path}/src`,
        fileContent: fastifyMongooseServerTs(),
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

export async function initMongooseTsKoa() {
  console.log('holi');
}
