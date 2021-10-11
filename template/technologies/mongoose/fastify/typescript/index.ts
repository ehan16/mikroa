export function app() {
  return `
  import { fastify } from 'fastify';
  import users from './routes/users';

const app = fastify({
  logger: true,
});

app.register(users);

app.get('/', (req, reply) => {
  reply.send('Hello Mikroa!');
});

export default app;

`;
}

export function server() {
  return `
  import mongoose from 'mongoose';
import app from './app';

async function start() {
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
    console.log(\`🚀 App running on \${process.env.HOST}:\${PORT}/\`);
  });
}

start();

  `;
}

export function example() {
  return `
  const userRoutes = (fastify, options, done) => {
    fastify.get('/', (req, reply) => {
      reply.send('Hello Mikroa');
    });
  };
  
  module.exports = userRoutes;
  `;
}
