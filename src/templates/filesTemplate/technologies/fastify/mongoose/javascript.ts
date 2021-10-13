export function fastifyMongooseAppJs() {
  return `
  const fastify = require('fastify')({ logger: true });
  const users = require('./routes/users');

  const app = fastify();
  
  app.register(users);
  
  module.exports = app;
`;
}

export function fastifyMongooseServerJs() {
  return `
  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  const app = require('./app');

  dotenv.config({ path: './src/variables.env' });
  
  async function main() {
    mongoose
      .connect(String(process.env.DATABASE), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        console.log(\`🤩🍃 MongoDB is Running\`);
      })
      .catch((err) => {
        console.log(\`❌🤬 \${err}\`);
        process.exit();
      });
  
    mongoose.connection.on('error', (err) => \`❌🤬 \${err}\`);
  
    const PORT = Number(process.env.PORT) || 5000;
  
    app.listen(PORT, (err) => {
      if (err) {
        console.error(\`❌🤬 \${err}\`);
        process.exit(1);
      }
      console.log(\`🚀 App running on http://localhost:\${PORT}/\`);
    });
  };
  
  main();
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
