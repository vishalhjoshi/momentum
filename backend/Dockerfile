FROM node:20-alpine

WORKDIR /app

# Install pnpm
npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build
# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Make start script executable and chown to node user
RUN chmod +x start.sh && chown node:node /app/start.sh

# Switch to non-root user
USER node

# Start the application
CMD ["./start.sh"]
