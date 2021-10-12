import { installPackage } from '../../../../../utils/npm.util';
import { createFiles } from '../../../../default/default.template';
import {
  app,
  server,
  indexRoutes,
  prisma,
  routes,
} from '../../../../../../template/technologies/prisma/fastify/javascript';
import { showError } from '../../../../../utils/logger.util';

export async function initPrismaJsFastify(path: string) {
  try {
    await installPackage(path, 'fastify');
    await installPackage(path, 'fastify-plugin');

    await createFiles([
      { fileName: 'app.js', filePath: `${path}/src`, fileContent: app() },
      { fileName: 'server.js', filePath: `${path}/src`, fileContent: server() },
      { fileName: 'prisma.js', filePath: `${path}/src`, fileContent: prisma() },
      {
        fileName: 'index.js',
        filePath: `${path}/src/routes`,
        fileContent: indexRoutes(),
      },
      {
        fileName: 'routes.js',
        filePath: `${path}/src/routes`,
        fileContent: routes(),
      },
    ]);
  } catch (err) {
    showError('An error has ocurred while generating the microservice');
  }
}
