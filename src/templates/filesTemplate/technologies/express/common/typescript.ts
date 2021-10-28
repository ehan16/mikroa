export function expressAppTs() {
  return `
  import express from 'express';

  // Routes
  import routes from './routes';

  const app = express();
  
  app.set('port', Number(process.env.PORT) || 3000);
  app.use('/', routes);
  
  export default app;
      `;
}

export function routesIndexTs() {
  return `
import { Router } from 'express';

const router = Router();

export default router;
  `;
}
