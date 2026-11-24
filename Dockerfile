# Stage 1: Build static Vite + React + Three.js bundle
FROM node:22-alpine AS builder

WORKDIR /app

# Avoid out-of-memory errors on low-RAM Coolify VPS nodes during TS + Three.js bundling
ENV NODE_OPTIONS="--max-old-space-size=1536"

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY index.html tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts ./
COPY public ./public
COPY src ./src

RUN npm run build

# Stage 2: Lightweight Nginx production runtime for Coolify
FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
