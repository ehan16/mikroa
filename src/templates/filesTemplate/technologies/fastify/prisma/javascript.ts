export function fastifyPrismaAppJs() {
  return `
  const fastify = require('fastify')({ logger: true });
const { router } = require('./routes');

const app = fastify();

app.register(router);

module.exports = app;
  `;
}

export function fastifyPrismaPrismaJs() {
  return `
  const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
  `;
}

export function fastifyPrismaServerJs() {
  return `
  const dotenv = require('dotenv');
  const app = require('./app');
const prisma = require('./prisma');

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

export function indexRoutesJs() {
  return `
  const { renderRoutes } = require('./routes');

const router = (fastify, opts, next) => {
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

module.exports = router;
  `;
}

export function routesJs() {
  return `
  const routes = {};

 const renderRoutes = Object.values(routes);

 module.exports = renderRoutes;
  `;
}
