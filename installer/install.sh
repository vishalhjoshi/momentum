#!/bin/bash
set -e

# Default values
POSTGRES_DB=${POSTGRES_DB:-momentum}
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
PORT=${PORT:-3000}

# Check for required variables
if [ -z "$POSTGRES_PASSWORD" ]; then
    echo "Error: POSTGRES_PASSWORD environment variable is required."
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "Error: JWT_SECRET environment variable is required."
    exit 1
fi

echo "Installing Momentum..."

# Copy docker-compose.yml to the mounted code directory
cp /usr/src/code/docker-compose.yml /app/docker-compose.yml

# Create .env file
cat > /app/.env <<EOF
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=${POSTGRES_DB}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-1d}
REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET:-refreshsecret}
REFRESH_TOKEN_EXPIRES_IN=${REFRESH_TOKEN_EXPIRES_IN:-7d}
NODE_ENV=${NODE_ENV:-production}
PORT=${PORT}
FRONTEND_URL=${FRONTEND_URL:-http://localhost}
DOCKER_REGISTRY_PREFIX=${DOCKER_REGISTRY_PREFIX}
EOF

echo "Configuration files created in mounted volume."

# Run docker compose
echo "Starting services..."
cd /app
docker compose up -d

echo "Momentum installed and started successfully!"
