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

export async function initMongooseExpress(language: string, path: string) {
  await installPackage(path, 'express');

  if (language === 'typescript') {
    await initMongooseTsExpress(path);
  } else {
    await initMongooseJsExpress(path);
  }
}
export async function initMongooseFastify(language: string, path: string) {
  await installPackage(path, 'fastify');
  await installPackage(path, 'fastify-plugin');

  if (language === 'typescript') {
    await initMongooseTsFastify(path);
  } else {
    await initMongooseJsFastify(path);
  }
}
export async function initMongooseKoa(language: string, path: string) {
  await installPackage(path, 'koa');
  await installPackage(path, 'koa-router');
  await installPackage(path, 'koa-bodyparser');

  if (language === 'typescript') {
    await initMongooseTsKoa(path);
  } else {
    await initMongooseJsKoa(path);
  }
}
export async function initPrismaExpress(language: string, path: string) {
  if (language === 'typescript') {
    await initPrismaTsExpress(path);
  } else {
    await initPrismaJsExpress(path);
  }
}
export async function initPrismaFastify(language: string, path: string) {
  if (language === 'typescript') {
    await initPrismaTsFastify(path);
  } else {
    await initPrismaJsFastify(path);
  }
}
export async function initPrismaKoa(language: string) {
  if (language === 'typescript') {
    await initPrismaTsKoa();
  } else {
    await initPrismaJsKoa();
  }
}
