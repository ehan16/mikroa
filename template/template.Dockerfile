# Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i -g npm@latest
RUN npm ci

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
ARG NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_URL
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_TOKEN
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm i -g npm@latest
RUN npm i -g @sentry/cli
RUN npx @sentry/wizard -i nextjs --quiet --skip-connect
RUN echo "defaults.org=$SENTRY_ORG" >> sentry.properties
RUN echo "defaults.project=$SENTRY_PROJECT" >> sentry.properties
RUN echo "auth.token=$SENTRY_TOKEN" >> sentry.properties
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

RUN npm i -g npm@latest

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3002

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start"]
