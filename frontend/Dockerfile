# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.11.0

# Copy package files
COPY frontend/package.json pnpm-lock.yaml ./

# Install dependencies (with cache)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY frontend .

# Set API URL for production build
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
