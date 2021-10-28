export function koaAppTs() {
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

export function koaRoutesTs() {
  return `
      import Router from 'koa-router';
    
    const router = new Router();
    
    router.get('/', async function (ctx: { body: { message: string } }) {
      ctx.body = { message: 'New Mikroa microservice!' };
    });
    
    const routes = router.routes();
    
    export default routes;
      `;
}
