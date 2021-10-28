import { showError } from '../../../../utils/logger.util';
import { createFiles } from '../../../default/default.template';
import {
  expressAppJs,
  fastifyPrismaAppJs,
  indexRoutesJs,
  routesJs,
  prismaPrismaJs,
  prismaServerJs,
  koaAppJs,
  koaRoutesJs,
  routesIndexJs,
} from '../../../filesTemplate/technologies';

export async function initPrismaJsExpress(path: string) {
  try {
    await createFiles([
      {
        fileName: 'app.js',
        filePath: `${path}/src`,
        fileContent: expressAppJs(),
      },
      {
        fileName: `prisma.js`,
        filePath: `${path}/src`,
        fileContent: prismaPrismaJs(),
      },
      {
        fileName: `server.js`,
        filePath: `${path}/src`,
        fileContent: prismaServerJs(),
      },
      {
        fileName: 'index.js',
        filePath: `${path}/src/routes`,
        fileContent: routesIndexJs(),
      },
    ]);
  } catch (err) {
    showError(
      'An error has ocurred while creating the prisma-express basic files'
    );
  }
}

export async function initPrismaJsFastify(path: string) {
  try {
    await createFiles([
      {
        fileName: 'app.js',
        filePath: `${path}/src`,
        fileContent: fastifyPrismaAppJs(),
      },
      {
        fileName: 'server.js',
        filePath: `${path}/src`,
        fileContent: prismaServerJs(),
      },
      {
        fileName: 'prisma.js',
        filePath: `${path}/src`,
        fileContent: prismaPrismaJs(),
      },
      {
        fileName: 'index.js',
        filePath: `${path}/src/routes`,
        fileContent: indexRoutesJs(),
      },
      {
        fileName: 'routes.js',
        filePath: `${path}/src/routes`,
        fileContent: routesJs(),
      },
    ]);
  } catch (err) {
    showError('An error has ocurred while generating the microservice');
  }
}

export async function initPrismaJsKoa(path: string) {
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
        fileContent: prismaServerJs(),
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
