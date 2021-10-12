export function app() {
  return `
  const fastify = require('fastify')({ logger: true });
const { router } = require('./routes');

const app = fastify();

app.register(router);

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

export default app;
  `;
}

export function prisma() {
  return `
  const { PrismaClient } = require('@prisma/client');

export const prisma = new PrismaClient();
  `;
}

export function server() {
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

export function indexRoutes() {
  return `
  const { renderRoutes } = require('./routes');

export const router = (fastify, opts, next) => {
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

export function routes() {
  return `
  const routes = {};

export const renderRoutes = Object.values(routes);
  `;
}
