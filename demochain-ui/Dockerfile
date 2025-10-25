# Multi-stage Dockerfile for Next.js (standalone output)

# 1) Build stage
FROM node:18-bullseye AS builder
WORKDIR /app

# Install deps
COPY package*.json ./

# Use official npm registry (best for Hong Kong or overseas)
ARG NPM_REGISTRY=https://registry.npmjs.org
RUN npm config set registry $NPM_REGISTRY \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 2 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 120000 \
    && npm -v \
    && node -v

# Install deps with retry logic (no flaky mirror)
RUN bash -c "npm ci || (sleep 3 && npm ci)"

# Copy source
COPY . .

# Build production
RUN npm run build

# 2) Runtime stage (minimal)
FROM node:18-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy standalone output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
