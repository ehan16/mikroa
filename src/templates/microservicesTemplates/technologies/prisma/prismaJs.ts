import { showError } from '../../../../utils/logger.util';
import { createFiles } from '../../../default/default.template';
import { installPackage } from '../../../../utils/npm.util';
import {
  prismaExpressPrismaJs,
  prismaExpressServerJs,
  expressAppJs,
  fastifyPrismaAppJs,
  fastifyPrismaServerJs,
  fastifyPrismaPrismaJs,
  indexRoutesJs,
  routesJs,
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
        fileContent: prismaExpressPrismaJs(),
      },
      {
        fileName: `server.js`,
        filePath: `${path}/src`,
        fileContent: prismaExpressServerJs(),
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
    await installPackage(path, 'fastify');
    await installPackage(path, 'fastify-plugin');

    await createFiles([
      {
        fileName: 'app.js',
        filePath: `${path}/src`,
        fileContent: fastifyPrismaAppJs(),
      },
      {
        fileName: 'server.js',
        filePath: `${path}/src`,
        fileContent: fastifyPrismaServerJs(),
      },
      {
        fileName: 'prisma.js',
        filePath: `${path}/src`,
        fileContent: fastifyPrismaPrismaJs(),
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

export async function initPrismaJsKoa() {
  console.log('holi');
}
