export default function packageJson(
  microserviceName: string,
  language: string,
  orm: string
) {
  return `
    {
      "name": "${microserviceName}",
      "version": "1.0.0",
      "description": "",
      "main" : "src/server.js",
      "scripts": {
       ${
         language === 'typescript'
           ? `
              "dev": "npm run build:ts && npm run watch",
              "build": "npm run build:ts && npm run lint",
              "serve": "node dist/server.js",
              "watch:node": "nodemon dist/server.js",
              "watch": "concurrently -k -p \\"[{name}]\\" -n \\"TypeScript,Node\\" -c   \\"cyan.bold,green.bold\\" \\"npm run watch:ts\\" \\"npm run watch:node\\"",
              "build:ts": "tsc -b",
              "watch:ts": "tsc -w",
              "lint": "npm run build:ts && eslint \\"**/*.{js,ts}\\" --quiet --fix",
            `
           : `
              "dev": "npm run watch",
              "serve": "node src/server.js"
              "watch": "nodemon src/server.js",
            `
       }
       ${
         orm === 'prisma'
           ? `
          "p:migrate:deploy": "npx prisma migrate deploy",
          "p:generate": "prisma generate",
          "p:prisma": "npx prisma",
          "p:init": "npx prisma init",
          "p:migrate": "npx prisma migrate dev --name init",
          "p:data-studio": "npx prisma studio",`
           : null
       }
       "start": "npm run serve",
       "format": "prettier --write \\"**/*.{js,json,${
         language === 'typescript' ? ',ts' : ''
       }}\\""
      },
      "keywords": [],
      "author": "",
      "license": "ISC"
    }
  `;
}
