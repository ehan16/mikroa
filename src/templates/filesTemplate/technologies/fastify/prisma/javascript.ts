export function fastifyPrismaAppJs() {
  return `
  const fastify = require('fastify');
const { router } = require('./routes');

const app = fastify({ logger: true });

// app.register(router);

module.exports = app;
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
