export const app = `
const fastify = require('fastify')({ logger: true });

const app = fastify();

app.register(require('./routes/users'));

app.get('/', (req, reply) => {
  reply.send('Hello Mikroa!');
});

export default app;
`;
