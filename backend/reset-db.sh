#!/bin/sh

# Script to force reset the database schema
# Useful when migrations are desynced (e.g. migration marked as applied but tables missing)

echo "Starting database reset process..."

# Check if DATABASE_URL is set, if not, construct it from parts
if [ -z "$DATABASE_URL" ]; then
  if [ -n "$POSTGRES_USER" ] && [ -n "$POSTGRES_PASSWORD" ]; then
    echo "Constructing DATABASE_URL from environment variables..."
    
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
    echo "DATABASE_URL constructed."
  else
    echo "ERROR: DATABASE_URL not set and missing components. Cannot reset."
    exit 1
  fi
fi

echo "WARNING: This will delete ALL data in the database."
echo "Running: npx prisma migrate reset --force"
npx prisma migrate reset --force

echo "Reset command finished."

echo "Verifying tables..."
# Use tsx to run the check script (since we have check-tables.ts)
npx tsx check-tables.ts

echo "Done."
