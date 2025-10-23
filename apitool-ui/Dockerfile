# Multi-stage Dockerfile for Next.js (standalone output)

# 1) Build stage
FROM node:18-bullseye AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build production
RUN npm run build

# 2) Runtime stage (minimal)
FROM node:18-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

# Copy standalone output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port 3001
EXPOSE 3001

# Start the server on $PORT (Next standalone reads PORT env)
CMD ["node", "server.js"]


