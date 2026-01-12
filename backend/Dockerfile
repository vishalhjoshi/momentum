# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@latest

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies (with cache)
RUN pnpm install --frozen-lockfile --filter momentum-backend...

# Copy source code
COPY backend ./backend

# Generate Prisma Client
RUN cd backend && npx prisma generate

# Build the application
RUN pnpm --filter momentum-backend build

# Prune development dependencies
RUN pnpm --filter momentum-backend --prod deploy pruned --legacy

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma (runtime dependency)
RUN apk add --no-cache openssl

# Copy built application and production dependencies from build stage
# Copy built application and production dependencies from build stage
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/pruned/node_modules ./node_modules
COPY --from=build /app/pruned/package.json ./package.json
COPY --from=build /app/backend/prisma ./prisma

COPY --from=build /app/backend/start.sh ./

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
