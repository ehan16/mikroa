// src

export function prismaExpressAppJs() {
  return `
    const express = require('express');
  
    // Routes
    const routes = require('./routes');
  
    const app = express();
    
    app.set('port', Number(process.env.PORT) || 3000);
    app.use('/', routes);
    
    export default app;
        `;
}

export function prismaExpressPrismaJs() {
  return `
    const { PrismaClient } = require('@prisma/client');

    export const prisma = new PrismaClient();
          `;
}

export function prismaExpressServerJs() {
  return `
    const dotenv = require('dotenv');
    const app = require('./app');
    
    async function main() {
      const PORT = Number(process.env.PORT);
    
      app.listen({ port: PORT }, () =>
        console.log(\`🚀 Server ready at http://localhost:\${PORT}\`)
      );
    }
    
    main();
    `;
}
