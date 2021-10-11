// src

export function appTs() {
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

export function prismaTs() {
  return `
  import { PrismaClient } from '@prisma/client';
  import { Request, Response } from 'express';
  
  export const prisma = new PrismaClient();
  
  export interface Context {
    prisma: PrismaClient;
    req: Request;
    res: Response;
  }
        `;
}

export function serverTs() {
  return `
  /* eslint-disable no-underscore-dangle */
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  /* eslint-disable @typescript-eslint/no-namespace */
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
  
  async function main() {
    const PORT = Number(process.env.PORT);
  
    app.listen({ port: PORT }, () =>
      console.log(\`🚀 Server ready at http://localhost:\${PORT}\`)
    );
  }
  
  main();
  `;
}
