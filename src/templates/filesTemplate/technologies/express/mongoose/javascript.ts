export function mongooseExpressServerJs() {
  return `
  const dotenv = require('dotenv');
  dotenv.config({ path: './src/variables.env' });
  const mongoose = require('mongoose');
  const app = require('./app');
  
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
    `;
}
