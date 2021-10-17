import { showError } from '../../../../utils/logger.util';
import { createFiles } from '../../../default/default.template';
import {
  expressAppJs,
  fastifyMongooseAppJs,
  fastifyMongooseExampleJs,
  koaAppJs,
  koaRoutesJs,
  mongooseServerJs,
  routesIndexJs,
} from '../../../filesTemplate/technologies';

export async function initMongooseJsExpress(path: string) {
  try {
    await createFiles([
      {
        fileName: 'app.js',
        filePath: `${path}/src`,
        fileContent: expressAppJs(),
      },
      {
        fileName: `server.js`,
        filePath: `${path}/src`,
        fileContent: mongooseServerJs(),
      },
      {
        fileName: `index.js`,
        filePath: `${path}/src/routes`,
        fileContent: routesIndexJs(),
      },
    ]);
  } catch (err) {
    showError(
      'An error has ocurred while creating the mongoose-express basic files'
    );
  }
}

export async function initMongooseJsFastify(path: string) {
  try {
    await createFiles([
      {
        fileName: 'app.js',
        filePath: `${path}/src`,
        fileContent: fastifyMongooseAppJs(),
      },
      {
        fileName: 'server.js',
        filePath: `${path}/src`,
        fileContent: mongooseServerJs(),
      },
      {
        fileName: 'users.js',
        filePath: `${path}/src/routes`,
        fileContent: fastifyMongooseExampleJs(),
      },
    ]);
  } catch (err) {
    showError(
      'An error has ocurred while creating the mongoose-express basic files'
    );
  }
}

export async function initMongooseJsKoa(path: string) {
  try {
    await createFiles([
      {
        fileName: 'app.js',
        filePath: `${path}/src`,
        fileContent: koaAppJs(),
      },
      {
        fileName: 'server.js',
        filePath: `${path}/src`,
        fileContent: mongooseServerJs(),
      },
      {
        fileName: 'index.js',
        filePath: `${path}/src/routes`,
        fileContent: koaRoutesJs(),
      },
    ]);
  } catch (err) {
    showError(
      'An error has ocurred while creating the mongoose-express basic files'
    );
  }
}
