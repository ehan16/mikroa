export default function packageJson(
  microserviceName: string,
  typescript: boolean = false
) {
  return `
  {
    "name": "${microserviceName}",
    "version": "1.0.0",
    "description": "",
    ${typescript ? '' : '"main" : "src/server.js",'} 
    "scripts": {
     ${
       typescript
         ? `
     "dev": "npm run build:ts && npm run watch",
    "start": "npm run serve",
    "build": "npm run build:ts && npm run lint",
    "serve": "node dist/server.js",
    "watch:node": "nodemon build/server.js",
    "watch": "concurrently -k -p \\"[{name}]\\" -n \\"TypeScript,Node\\" -c \\"cyan.bold,green.bold\\" \\"npm run watch:ts\\" \\"npm run watch:node\\"",
    "build:ts": "tsc -b",
    "watch:ts": "tsc -w",
    "lint": "npm run build:ts && eslint \\"**/*.{js,ts}\\" --quiet --fix",
    "format": "prettier --write \\"**/*.{js,jsx,ts,tsx}\\"",
     `
         : ''
     }
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
  }
  
  `;
}
