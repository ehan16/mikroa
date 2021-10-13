export function fastifyPrismaAppTs() {
  return `
  import { fastify } from 'fastify';
  import { router } from './routes';
  
  const app = fastify({
    logger: true,
  });
  
  app.register(router);
  
  app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.send(users)
  })
  
  export default app;
  `;
}

export function fastifyPrismaPrismaTs() {
  return `
  import { PrismaClient } from '@prisma/client';

  export const prisma = new PrismaClient();
  `;
}

export function fastifyPrismaServerTs() {
  return `
  import dotenv from 'dotenv';
  import app from './app';
  import prisma from './prisma';
  
  dotenv.config();

  async function start() {
    const PORT = Number(process.env.PORT) || 5000;
  
    app.listen(PORT, (err) => {
      if (err) {
        console.error(\`❌🤬 \${err}\`);
        process.exit(1);
      }
      console.log(\`🚀 Server ready at http://localhost:\${PORT}\`);
    });
  }
  
  start();
  
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
    req.user = null;
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
