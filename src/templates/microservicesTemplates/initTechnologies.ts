import { initMongooseJsExpress } from './technologies/mongoose/mongoose-js/mongooseJsExpress';
import { initMongooseJsFastify } from './technologies/mongoose/mongoose-js/mongooseJsFastify';
import { initMongooseJsKoa } from './technologies/mongoose/mongoose-js/mongooseJsKoa';
import { initMongooseTsExpress } from './technologies/mongoose/mongoose-ts/mongooseExpress';
import { initMongooseTsFastify } from './technologies/mongoose/mongoose-ts/mongooseFastify';
import { initMongooseTsKoa } from './technologies/mongoose/mongoose-ts/mongooseKoa';
import { initPrismaJsExpress } from './technologies/prisma/prisma-js/prismaJsExpress';
import { initPrismaJsFastify } from './technologies/prisma/prisma-js/prismaJsFastify';
import { initPrismaJsKoa } from './technologies/prisma/prisma-js/prismaJsKoa';
import { initPrismaTsExpress } from './technologies/prisma/prisma-ts/prismaTsExpress';
import { initPrismaTsFastify } from './technologies/prisma/prisma-ts/prismaTsFastify';
import { initPrismaTsKoa } from './technologies/prisma/prisma-ts/prismaTsKoa';
import { initSequelizeJsExpress } from './technologies/sequelize/sequelize-js/sequelizeJsExpress';
import { initSequelizeJsFastify } from './technologies/sequelize/sequelize-js/sequelizeJsFastify';
import { initSequelizeJsKoa } from './technologies/sequelize/sequelize-js/sequelizeJsKoa';
import { initSequelizeTsExpress } from './technologies/sequelize/sequelize-ts/sequelizeTsExpress';
import { initSequelizeTsFastify } from './technologies/sequelize/sequelize-ts/sequelizeTsFastify';
import { initSequelizeTsKoa } from './technologies/sequelize/sequelize-ts/sequelizeTsKoa';

export async function initMongooseExpress(language: string) {
  if (language === 'typescript') {
    await initMongooseTsExpress();
  } else {
    await initMongooseJsExpress();
  }
}
export async function initMongooseFastify(language: string, path: string) {
  if (language === 'typescript') {
    await initMongooseTsFastify(path);
  } else {
    await initMongooseJsFastify(path);
  }
}
export async function initMongooseKoa(language: string) {
  if (language === 'typescript') {
    await initMongooseTsKoa();
  } else {
    await initMongooseJsKoa();
  }
}
export async function initSequelizeExpress(language: string) {
  if (language === 'typescript') {
    await initSequelizeTsExpress();
  } else {
    await initSequelizeJsExpress();
  }
}
export async function initSequelizeFastify(language: string) {
  if (language === 'typescript') {
    await initSequelizeTsFastify();
  } else {
    await initSequelizeJsFastify();
  }
}
export async function initSequelizeKoa(language: string) {
  if (language === 'typescript') {
    await initSequelizeTsKoa();
  } else {
    await initSequelizeJsKoa();
  }
}
export async function initPrismaExpress(language: string) {
  if (language === 'typescript') {
    await initPrismaTsExpress();
  } else {
    await initPrismaJsExpress();
  }
}
export async function initPrismaFastify(language: string, path: string) {
  if (language === 'typescript') {
    await initPrismaTsFastify(path);
  } else {
    await initPrismaJsFastify();
  }
}
export async function initPrismaKoa(language: string) {
  if (language === 'typescript') {
    await initPrismaTsKoa();
  } else {
    await initPrismaJsKoa();
  }
}
