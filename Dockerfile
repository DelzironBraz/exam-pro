# ─────────────────────────────────────────────
# Stage 1: base — dependências + schema Prisma (multi-file)
# ─────────────────────────────────────────────
FROM node:22-alpine3.21 AS base
WORKDIR /app
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma/schema ./prisma/schema

# ─────────────────────────────────────────────
# Stage 2: deps de desenvolvimento
# ─────────────────────────────────────────────
FROM base AS deps-dev
RUN npm ci

# ─────────────────────────────────────────────
# Stage 3: deps de produção
# ─────────────────────────────────────────────
FROM base AS deps-prod
RUN npm ci --omit=dev && npm cache clean --force

# ─────────────────────────────────────────────
# Stage 4: builder — compila o projeto
# ─────────────────────────────────────────────
FROM deps-dev AS builder
COPY . .
RUN npm run prisma:generate && npm run build

# ─────────────────────────────────────────────
# Stage 5: development — hot-reload com volume
# ─────────────────────────────────────────────
FROM node:22-alpine3.21 AS development
WORKDIR /app

COPY --from=deps-dev /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY webpack-hmr.config.js ./
COPY .swcrc ./
COPY scripts/docker-dev-entrypoint.sh ./scripts/docker-dev-entrypoint.sh
RUN chmod +x ./scripts/docker-dev-entrypoint.sh

# Evita node_modules como root no volume anônimo (/app/node_modules)
RUN chown -R node:node /app
USER node

EXPOSE 3000
# A imagem node:* tem ENTRYPOINT que prefixa "node" — usar sh explicitamente
CMD ["sh", "./scripts/docker-dev-entrypoint.sh"]

# ─────────────────────────────────────────────
# Stage 6: production — imagem mínima e segura
# ─────────────────────────────────────────────
FROM node:22-alpine3.21 AS production

RUN apk add --no-cache dumb-init curl

# Usuário sem privilégios
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

WORKDIR /app

# dist + deps de prod (client Prisma compilado no build)
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=builder   /app/dist         ./dist
COPY package*.json ./

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]

# Migrations em script separado; aqui apenas sobe o servidor
CMD ["node", "dist/main.js"]
