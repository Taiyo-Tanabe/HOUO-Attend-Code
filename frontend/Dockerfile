FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# 開発用：next dev でホットリロード
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

# ビルド
FROM base AS builder
COPY . .
RUN npm run build

# 本番用：最小イメージ
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
