#!/bin/sh

# wait for postgres to be ready (optional, but handled by docker-compose depends_on healthcheck usually, but good to have retry logic if needed. 
# For now, we assume depends_on works.)

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting server..."
npm start
