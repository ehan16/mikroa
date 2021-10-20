import { showError } from '../../../../utils/logger.util';
import { createFiles } from '../../../default/default.template';
import { installPackage } from '../../../../utils/npm.util';
import {
  expressAppTs,
  prismaExpressPrismaTs,
  fastifyPrismaAppTs,
  fastifyPrismaPrismaTs,
  indexRoutesTs,
  routesTs,
  prismaServerTs,
  koaAppTs,
  koaRoutesTs,
} from '../../../filesTemplate/technologies';

export async function initPrismaTsExpress(path: string) {
  try {
    await installPackage(path, '@types/express');
    await createFiles([
      {
        fileName: 'app.ts',
        filePath: `${path}/src`,
        fileContent: expressAppTs(),
      },
      {
        fileName: `prisma.ts`,
        filePath: `${path}/src`,
        fileContent: prismaExpressPrismaTs(),
      },
      {
        fileName: `server.ts`,
        filePath: `${path}/src`,
        fileContent: prismaServerTs(),
      },
    ]);
  } catch (err) {
    showError(
      'An error has ocurred while creating the prisma-express basic files'
    );
  }
}

export async function initPrismaTsFastify(path: string) {
  try {
    await createFiles([
      {
        fileName: 'app.ts',
        filePath: `${path}/src`,
        fileContent: fastifyPrismaAppTs(),
      },
      {
        fileName: 'server.ts',
        filePath: `${path}/src`,
        fileContent: prismaServerTs(),
      },
      {
        fileName: 'prisma.ts',
        filePath: `${path}/src`,
        fileContent: fastifyPrismaPrismaTs(),
      },
      {
        fileName: 'index.ts',
        filePath: `${path}/src/routes`,
        fileContent: indexRoutesTs(),
      },
      {
        fileName: 'routes.ts',
        filePath: `${path}/src/routes`,
        fileContent: routesTs(),
      },
    ]);
  } catch (err) {
    showError('An error has ocurred while generating the microservice');
  }
}

export async function initPrismaTsKoa(path: string) {
  try {
    await createFiles([
      {
        fileName: 'app.ts',
        filePath: `${path}/src`,
        fileContent: koaAppTs(),
      },
      {
        fileName: 'server.ts',
        filePath: `${path}/src`,
        fileContent: prismaServerTs(),
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
