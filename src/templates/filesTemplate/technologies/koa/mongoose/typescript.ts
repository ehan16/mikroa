export function koaMongooseAppTs() {
  return `
  import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import routes from './routes';

const app = new Koa();

app.use(bodyParser());
app.use(routes);

export default app;
  `;
}

export function koaMongooseServerTs() {
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

  mongoose.connection.on('error', (err) => \`❌🤬❌🤬 \${err}\`);

  const PORT = Number(process.env.PORT);

  app.listen({ port: PORT }, () =>
    console.log(\`🚀 Server ready at http://localhost:\${PORT}\`)
  );
}

main();

  `;
}

export function koaMongooseRoutesTs() {
  return `
  import * as Router from 'koa-router';

const router = new Router();

router.get('/', async function (ctx) {
  ctx.body = { message: 'New Mikroa microservice!' };
});

const routes = router.routes();

export default routes;
  `;
}
