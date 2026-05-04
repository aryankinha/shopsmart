# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

ENV NODE_ENV=production

# Install serve globally (requires root, so do it before switching user)
RUN npm install -g serve

# Set non-root user
USER node

WORKDIR /app

# Copy built assets
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["serve", "-s", "dist", "-l", "3000"]