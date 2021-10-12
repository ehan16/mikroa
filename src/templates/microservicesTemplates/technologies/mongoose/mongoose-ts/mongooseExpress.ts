import { mongooseExpressServerTs } from '../../../../../../template/technologies/mongoose/express/typescript';
import { prismaMongooseExpressAppTs } from '../../../../../../template/technologies/prisma/express/typescript';
import { showError } from '../../../../../utils/logger.util';
import { createFiles } from '../../../../default/default.template';

export async function initMongooseTsExpress(path: string) {
  try {
    await createFiles([
      {
        fileName: 'app.ts',
        filePath: `${path}/src`,
        fileContent: prismaMongooseExpressAppTs(),
      },
      {
        fileName: `server.ts`,
        filePath: `${path}/src`,
        fileContent: mongooseExpressServerTs(),
      },
    ]);
  } catch (err) {
    showError(
      'An error has ocurred while creating the mongoose-express basic files'
    );
  }
}
