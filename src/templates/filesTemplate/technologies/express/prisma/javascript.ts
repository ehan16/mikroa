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
