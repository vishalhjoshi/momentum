# Starting the Backend Server

## Quick Start

1. **Make sure you're in the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Make sure you have a `.env` file with at least:
   ```bash
   DATABASE_URL="your-postgres-connection-string"
   JWT_SECRET="your-secret-key-min-32-chars"
   JWT_EXPIRES_IN="15m"
   REFRESH_TOKEN_SECRET="your-refresh-secret-min-32-chars"
   REFRESH_TOKEN_EXPIRES_IN="30d"
   PORT=3000
   ```

4. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Server listening on http://0.0.0.0:3000
   ```

6. **Test the health endpoint:**
   ```bash
   curl http://localhost:3000/healthz
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

7. **Test signup:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## Troubleshooting

- **Port 3000 already in use:** Kill the process or change PORT in .env
- **Database connection errors:** Check your DATABASE_URL
- **TypeScript errors:** The server should still run with tsx, but fix them for production

