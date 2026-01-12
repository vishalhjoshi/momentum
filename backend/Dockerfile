# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@latest

# Copy package files
COPY backend/package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY backend .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN pnpm build

# Prune development dependencies
RUN pnpm prune --prod

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma (runtime dependency)
RUN apk add --no-cache openssl

# Copy built application and production dependencies from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

COPY start.sh ./

# Make start script executable
RUN chmod +x start.sh && chown -R node:node /app

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/healthz', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["./start.sh"]
