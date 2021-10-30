import { installPackage } from '../../utils/npm.util';
import {
  initMongooseJsExpress,
  initMongooseJsFastify,
  initMongooseJsKoa,
} from './technologies/mongoose/mongooseJs';
import {
  initMongooseTsExpress,
  initMongooseTsFastify,
  initMongooseTsKoa,
} from './technologies/mongoose/mongooseTs';
import {
  initPrismaJsExpress,
  initPrismaJsFastify,
  initPrismaJsKoa,
} from './technologies/prisma/prismaJs';
import {
  initPrismaTsExpress,
  initPrismaTsFastify,
  initPrismaTsKoa,
} from './technologies/prisma/prismaTs';

export async function initMongooseExpress(
  language: string,
  path: string,
  install: boolean
) {
  await installPackage(path, 'express', install);

  if (language === 'typescript') {
    await initMongooseTsExpress(path, install);
  } else {
    await initMongooseJsExpress(path);
  }
}
export async function initMongooseFastify(
  language: string,
  path: string,
  install: boolean
) {
  await installPackage(path, 'fastify', install);
  await installPackage(path, 'fastify-plugin', install);

  if (language === 'typescript') {
    await initMongooseTsFastify(path, install);
  } else {
    await initMongooseJsFastify(path);
  }
}
export async function initMongooseKoa(
  language: string,
  path: string,
  install: boolean
) {
  await installPackage(path, 'koa', install);
  await installPackage(path, 'koa-router', install);
  await installPackage(path, 'koa-bodyparser', install);

  if (language === 'typescript') {
    await initMongooseTsKoa(path, install);
  } else {
    await initMongooseJsKoa(path);
  }
}
export async function initPrismaExpress(
  language: string,
  path: string,
  install: boolean
) {
  await installPackage(path, 'express', install);

  if (language === 'typescript') {
    await initPrismaTsExpress(path, install);
  } else {
    await initPrismaJsExpress(path);
  }
}
export async function initPrismaFastify(
  language: string,
  path: string,
  install: boolean
) {
  await installPackage(path, 'fastify', install);
  await installPackage(path, 'fastify-plugin', install);

  if (language === 'typescript') {
    await initPrismaTsFastify(path);
  } else {
    await initPrismaJsFastify(path);
  }
}
export async function initPrismaKoa(
  language: string,
  path: string,
  install: boolean
) {
  await installPackage(path, 'koa', install);
  await installPackage(path, 'koa-router', install);
  await installPackage(path, 'koa-bodyparser', install);

  if (language === 'typescript') {
    await initPrismaTsKoa(path, install);
  } else {
    await initPrismaJsKoa(path);
  }
}
