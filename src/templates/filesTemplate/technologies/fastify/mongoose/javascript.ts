export function fastifyMongooseAppJs() {
  return `
  const fastify = require('fastify')({ logger: true });
  const users = require('./routes/users');

  const app = fastify();
  
  app.register(users);
  
  module.exports = app;
`;
}

export function fastifyMongooseExampleJs() {
  return `
  const userRoutes = (fastify, options, done) => {
    fastify.get('/', (req, reply) => {
      reply.send('Hello Mikroa');
    });
  };
  
  module.exports = userRoutes;
  `;
}
