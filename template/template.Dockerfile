# Install dependencies only when needed
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

EXPOSE 3001

CMD ["npm", "start" ]
