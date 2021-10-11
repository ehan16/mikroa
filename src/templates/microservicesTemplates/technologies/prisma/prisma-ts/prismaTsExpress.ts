import {
  prismaExpressAppTs,
  prismaExpressPrismaTs,
  prismaExpressServerTs,
} from '../../../../../../template/technologies/prisma/express/typescript';
import { showError } from '../../../../../utils/logger.util';
import { executePackage, installPackage } from '../../../../../utils/npm.util';
import { createFiles } from '../../../../default/default.template';

export async function initPrismaTsExpress(path: string) {
  try {
    await Promise.all([
      installPackage(path, 'prisma', '--save-dev'),
      executePackage(path, 'prisma', 'init'),
    ]);
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
