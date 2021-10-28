export function fastifyMongooseAppJs() {
  return `
  const fastify = require('fastify');
  const users = require('./routes/users');

  const app = fastify({ logger: true });
  
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
    done();
  };
  
  module.exports = userRoutes;
  `;
}
