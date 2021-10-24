export function dockerfile(port: string = '3001') {
  return `# Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i -g npm@latest
RUN npm ci

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm i -g npm@latest
RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

RUN npm i -g npm@latest

ENV NODE_ENV production

COPY --from=builder /app/src/variables.env ./src/variables.env
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE ${port}

CMD ["npm", "start" ]

  `;
}

export function dockerignore() {
  return `# docker files
.dockerignore

# dependencies
node_modules
.pnp
.pnp.js
jspm_packages

# debug
logs
*.log
npm-debug.log
yarn-debug.log
yarn-error.log
lerna-debug.log*
.pnpm-debug.log*

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# local env files
.env
.env.test
.env.production
.env.local
.env.development.local
.env.test.local
.env.production.local

README.md
.cache
.git
  `;
}

export function env() {
  return `NODE_ENV=
PORT=
SECRET=
URL=
DATABASE_URL=
  `;
}

export function eslintignore() {
  return `/node_modules/* in the project root is ignored by default
# build artefacts
dist/*
coverage/*
# data definition files
**/*.d.ts
# 3rd party libs
/src/public/
# custom definition files
/src/types/  
  `;
}

export function eslintrcjs() {
  return `
module.exports = {
  extends: ['avilatek-typescript'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-use-before-define': 'off',
    'prefer-arrow-callback': 'off',
  },
};  
  `;
}

export function gitignore() {
  return `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
jspm_packages/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*
  
# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
  
# next.js
/.next/
/out/

.cache/

# testing
/coverage

# production
/build
/dist
/lib

# misc
.DS_Store

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.test
.env.production
.env.local
.env.development.local
.env.test.local
.env.production.local

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*
  `;
}

export function tsconfig() {
  return `
{
  "compilerOptions": {
    "target": "es6",
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": false,
    "module": "CommonJS",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "inlineSources": true,
    "sourceRoot": "/",
    "noEmitHelpers": true,
    "importHelpers": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "*": ["node_modules/*", "src/types/*"]
    },
    "typeRoots": ["./src/types/*", "./node_modules/@types/*"]
  },
  "include": ["src/**/*"]
}
  `;
}

export function prettierignore() {
  return `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
jspm_packages/

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
.env*

# debug
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*
  `;
}

export function prettierrc() {
  return `
{
  "printWidth": 80,
  "bracketSpacing": true,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "useTabs": false
}  
  `;
}
