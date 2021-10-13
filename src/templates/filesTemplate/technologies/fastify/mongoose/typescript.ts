export function fastifyMongooseAppTs() {
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

export function fastifyMongooseServerTs() {
  return `
  import mongoose from 'mongoose';
  import dotenv from 'dotenv';
  import app from './app';

  dotenv.config();

  declare global {
    namespace NodeJS {
      interface Global {
        __rootdir__: string;
      }
    }
  }
  
  // @ts-expect-error
  global.__rootdir__ = process.cwd() || __dirname;

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
    console.log(\`🚀 App running on http://localhost:\${PORT}/\`);
  });
}

start();

  `;
}

export function fastifyMongooseExampleTs() {
  return `
  const userRoutes = (fastify, options, done) => {
    fastify.get('/', (req, reply) => {
      reply.send('Hello Mikroa');
    });
  };
  
  module.exports = userRoutes;
  `;
}
