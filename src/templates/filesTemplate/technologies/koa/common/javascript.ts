export function koaAppJs() {
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

export function koaRoutesJs() {
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
