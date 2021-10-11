import {
  prismaExpressAppTs,
  prismaExpressPrismaTs,
  prismaExpressServerTs,
} from '../../../../../../template/technologies/prisma/express/typescript';
import { showError } from '../../../../../utils/logger.util';
import { createFiles } from '../../../../default/default.template';

export async function initPrismaTsExpress(path: string) {
  try {
    await createFiles([
      {
        fileName: 'app.ts',
        filePath: `${path}/src`,
        fileContent: prismaExpressAppTs(),
      },
      {
        fileName: `prisma.ts`,
        filePath: `${path}/src`,
        fileContent: prismaExpressPrismaTs(),
      },
      {
        fileName: `server.ts`,
        filePath: `${path}/src`,
        fileContent: prismaExpressServerTs(),
      },
    ]);
  } catch (err) {
    showError('An error has ocurred while creating the API Gateway');
  }
}
