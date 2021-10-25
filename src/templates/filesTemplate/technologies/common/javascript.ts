// Mongoose
export function mongooseServerJs() {
  return `
    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    const app = require('./app');
  
    dotenv.config({ path: './src/variables.env' });
    
    async function main() {
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
    };
    
    main();
    `;
}

// Prisma
export function prismaPrismaJs() {
  return `
    const { PrismaClient } = require('@prisma/client');

    const prisma = new PrismaClient();

    module.exports = prisma;
          `;
}

export function prismaServerJs() {
  return `
  const dotenv = require('dotenv');
  const app = require('./app');

dotenv.config({ path: './.env' });

async function start() {
  const PORT = Number(process.env.PORT) || 5000;

  app.listen(PORT, (err) => {
    if (err) {
      console.error(\`❌🤬 \${err}\`);
      process.exit(1);
    }
    console.log(\`🚀 Server ready at http://localhost:\${PORT}\`);
  });
}

start();
  `;
}
