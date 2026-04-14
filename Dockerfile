# syntax=docker/dockerfile:1.7

FROM node:20-bullseye-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

FROM base AS deps
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --legacy-peer-deps

FROM base AS builder

ARG DATABASE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BASE_URL

ENV NODE_ENV=production \
    DATABASE_URL=${DATABASE_URL} \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-} \
    NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL:-}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM deps AS prod-deps
RUN npm prune --omit=dev

FROM node:20-bullseye-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BASE_URL
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    DATABASE_URL=${DATABASE_URL} \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-} \
    NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL:-}

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
CMD ["npm", "run", "start"]
