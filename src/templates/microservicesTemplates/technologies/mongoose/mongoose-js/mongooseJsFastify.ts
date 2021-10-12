import { installPackage } from '../../../../../utils/npm.util';
import { createFiles } from '../../../../default/default.template';
import {
  app,
  example,
  server,
} from '../../../../../../template/technologies/mongoose/fastify/javascript';

export async function initMongooseJsFastify(path: string) {
  await installPackage(path, 'fastify');
  await installPackage(path, 'fastify-plugin');

  await createFiles([
    { fileName: 'app.js', filePath: `${path}/src`, fileContent: app() },
    { fileName: 'server.js', filePath: `${path}/src`, fileContent: server() },
    {
      fileName: 'users.js',
      filePath: `${path}/src/routes`,
      fileContent: example(),
    },
  ]);
}
