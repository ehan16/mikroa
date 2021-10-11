import { installPackage } from '../../../../../utils/npm.util';
import { createFiles } from '../../../../default/default.template';
import {
  app,
  example,
  server,
} from '../../../../../../template/technologies/mongoose/fastify/typescript';
import { showError } from '../../../../../utils/logger.util';

export async function initMongooseTsFastify(path: string) {
  try {
    await installPackage(path, 'fastify');
    await installPackage(path, 'fastify-plugin');
    await installPackage(path, '@types/connect-mongo', '-D');

    await createFiles([
      { fileName: 'app.ts', filePath: `${path}/src`, fileContent: app() },
      { fileName: 'server.ts', filePath: `${path}/src`, fileContent: server() },
      {
        fileName: 'users.ts',
        filePath: `${path}/src/routes`,
        fileContent: example(),
      },
    ]);
  } catch (err) {
    showError('An error has ocurred while generating the microservice');
  }
}
