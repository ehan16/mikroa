export function fastifyPrismaAppTs() {
  return `
  import { fastify } from 'fastify';
  import { router } from './routes';
  import { prisma } from './prisma';
  
  const app = fastify({
    logger: true,
  });
  
  // app.register(router);
  
  export default app;
  `;
}

export function fastifyPrismaPrismaTs() {
  return `
  import { PrismaClient } from '@prisma/client';

  export const prisma = new PrismaClient();
  `;
}

export function indexRoutesTs() {
  return `
  import { FastifyInstance, FastifyPluginCallback } from 'fastify';
  import { renderRoutes } from './routes';

export const router: FastifyPluginCallback = (
  fastify: FastifyInstance,
  opts,
  next
) => {
  fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', (req, res, next) => {
    console.log('onRequest');
    next();
  });

  for (let route of renderRoutes) {
    fastify.route(route);
  }

  next();
};

  `;
}

export function routesTs() {
  return `
  import { RouteOptions } from 'fastify'

  type RouteConfig = Record<string, RouteOptions>
  
  const routes: RouteConfig = {}
  
  export const renderRoutes = Object.values(routes)
  `;
}
