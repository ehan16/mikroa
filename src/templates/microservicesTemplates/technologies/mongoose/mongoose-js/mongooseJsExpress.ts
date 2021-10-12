import { mongooseExpressServerJs } from '../../../../../../template/technologies/mongoose/express/javascript';
import { prismaExpressAppJs } from '../../../../../../template/technologies/prisma/express/javascript';
import { showError } from '../../../../../utils/logger.util';
import { createFiles } from '../../../../default/default.template';

export async function initMongooseJsExpress(path: string) {
  try {
    await createFiles([
      {
        fileName: 'app.ts',
        filePath: `${path}/src`,
        fileContent: prismaExpressAppJs(),
      },
      {
        fileName: `server.ts`,
        filePath: `${path}/src`,
        fileContent: mongooseExpressServerJs(),
      },
    ]);
  } catch (err) {
    showError(
      'An error has ocurred while creating the mongoose-express basic files'
    );
  }
}
