#!/bin/sh

# wait for postgres to be ready (optional, but handled by docker-compose depends_on healthcheck usually, but good to have retry logic if needed. 
# For now, we assume depends_on works.)

# Explicitly unset DATABASE_URL to force construction from individual variables
# This prevents leaking of local/dev DATABASE_URL into the container
unset DATABASE_URL

# Check if DATABASE_URL is set, if not, construct it from parts
if [ -z "$DATABASE_URL" ]; then
  if [ -n "$POSTGRES_USER" ] && [ -n "$POSTGRES_PASSWORD" ]; then
    echo "Constructing DATABASE_URL from environment variables for migration..."
    
    # Use node to URL encode values to handle special characters safely
    url_encode() {
      node -e "console.log(encodeURIComponent(process.argv[1]))" "$1"
    }

    ENCODED_USER=$(url_encode "$POSTGRES_USER")
    ENCODED_PASS=$(url_encode "$POSTGRES_PASSWORD")
    ENCODED_DB=$(url_encode "$POSTGRES_DB")
    HOST="${POSTGRES_HOST:-postgres}"
    DB_PORT="${POSTGRES_PORT:-5432}"

    export DATABASE_URL="postgres://${ENCODED_USER}:${ENCODED_PASS}@${HOST}:${DB_PORT}/${ENCODED_DB}?schema=public"
    echo "Constructed DATABASE_URL: postgres://***:***@${HOST}:${DB_PORT}/${ENCODED_DB}?schema=public"
  else
    echo "WARNING: DATABASE_URL not set and missing components. Migrations may fail."
  fi
fi

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting server..."
npm start
