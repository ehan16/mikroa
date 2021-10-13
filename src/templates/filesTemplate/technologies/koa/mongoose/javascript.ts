export function koaMongooseAppJs() {
  return `
  const Koa = require('koa');
  const bodyParser = require('koa-bodyparser');
  const routes = require('./routes');
  
  const app = new Koa();
  
  app.use(bodyParser());
  app.use(routes);
  
  module.exports = app;
  
  `;
}

export function koaMongooseServerJs() {
  return `
  const mongoose = require('mongoose');
  const app = require('./app');

const start = async () => {
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
};

start();

  `;
}

export function koaMongooseRoutesJs() {
  return `
  const Router = require('koa-router');

const router = new Router();

router.get('/', async function (ctx) {
  ctx.body = { message: 'New Mikroa microservice!' };
});

const routes = router.routes();

module.exports = routes;

  `;
}
