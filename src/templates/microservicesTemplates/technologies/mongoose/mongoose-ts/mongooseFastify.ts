import { installPackage } from '../../../../../utils/npm.util';
import { createFiles } from '../../../../default/default.template';
import {
  app,
  example,
  server,
} from '../../../../../../template/technologies/mongoose/fastify/typescript';

export async function initMongooseTsFastify(path: string) {
  await installPackage(path, 'fastify');
  await installPackage(path, 'fastify-plugin');
  await installPackage(path, 'mongoose');
  await installPackage(path, '@types/connect-mongo', '-D');

  await createFiles([
    { fileName: 'app.ts', filePath: path, fileContent: app() },
    { fileName: 'server.ts', filePath: path, fileContent: server() },
    {
      fileName: 'users.ts',
      filePath: `${path}/routes`,
      fileContent: example(),
    },
  ]);
}
