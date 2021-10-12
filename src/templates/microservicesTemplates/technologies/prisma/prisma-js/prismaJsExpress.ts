import {
  prismaExpressAppJs,
  prismaExpressPrismaJs,
  prismaExpressServerJs,
} from '../../../../../../template/technologies/prisma/express/javascript';
import { showError } from '../../../../../utils/logger.util';
import { createFiles } from '../../../../default/default.template';

export async function initPrismaJsExpress(path: string) {
  try {
    await createFiles([
      {
        fileName: 'app.js',
        filePath: `${path}/src`,
        fileContent: prismaExpressAppJs(),
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
    showError('An error has ocurred while creating the API Gateway');
  }
}
