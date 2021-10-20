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

  dotenv.config({ path: './src/variables.env' });

async function main() {
  mongoose
    .connect(String(process.env.DATABASE_URL), {
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

main();

  `;
}

export function fastifyMongooseExampleTs() {
  return `
  const userRoutes = (fastify, options, done) => {
    fastify.get('/', (req, reply) => {
      reply.send('Hello Mikroa');
    });
  };
  
  export default userRoutes;
  `;
}
