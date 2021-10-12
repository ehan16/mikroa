import { installPackage } from '../../../../../utils/npm.util';
import { createFiles } from '../../../../default/default.template';
import {
  app,
  server,
  indexRoutes,
  prisma,
  routes,
} from '../../../../../../template/technologies/prisma/fastify/typescript';
import { showError } from '../../../../../utils/logger.util';

export async function initPrismaTsFastify(path: string) {
  try {
    await installPackage(path, 'fastify');
    await installPackage(path, 'fastify-plugin');

    await createFiles([
      { fileName: 'app.ts', filePath: `${path}/src`, fileContent: app() },
      { fileName: 'server.ts', filePath: `${path}/src`, fileContent: server() },
      { fileName: 'prisma.ts', filePath: `${path}/src`, fileContent: prisma() },
      {
        fileName: 'index.ts',
        filePath: `${path}/src/routes`,
        fileContent: indexRoutes(),
      },
      {
        fileName: 'routes.ts',
        filePath: `${path}/src/routes`,
        fileContent: routes(),
      },
    ]);
  } catch (err) {
    showError('An error has ocurred while generating the microservice');
  }
}
