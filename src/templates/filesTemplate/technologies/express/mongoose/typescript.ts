export function mongooseExpressServerTs() {
  return `
  /* eslint-disable import/newline-after-import */
  /* eslint-disable import/first */
  import dotenv from 'dotenv';
  dotenv.config({ path: './src/variables.env' });
  import mongoose from 'mongoose';
  import app from './app';
  
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
};

main();
    `;
}
