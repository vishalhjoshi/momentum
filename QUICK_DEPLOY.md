# Quick Deploy Guide

Get your Momentum app deployed in under 10 minutes! This guide provides the fastest path to production.

## Choose Your Platform

### Option 1: Railway (Recommended - Easiest)

**Time: ~5 minutes**

1. **Sign up** at [railway.app](https://railway.app)

2. **Create new project** → Add PostgreSQL database

3. **Add backend service**:
   - New → GitHub Repo → Select your repo
   - Root Directory: `backend`
   - Add environment variables:
     ```
     NODE_ENV=production
     JWT_SECRET=<run: openssl rand -base64 32>
     JWT_EXPIRES_IN=15m
     REFRESH_TOKEN_SECRET=<run: openssl rand -base64 32>
     REFRESH_TOKEN_EXPIRES_IN=30d
     FRONTEND_URL=<will add after frontend is deployed>
     ```
   - Generate domain

4. **Add frontend service**:
   - New → GitHub Repo (same repo)
   - Root Directory: `frontend`
   - Add environment variables:
     ```
     VITE_API_URL=<your-backend-url>/api
     ```
   - Generate domain

5. **Update backend** `FRONTEND_URL` with your frontend domain

✅ Done! Your app is live.

---

### Option 2: Render

**Time: ~7 minutes**

1. **Sign up** at [render.com](https://render.com)

2. **Create PostgreSQL database**:
   - New → PostgreSQL
   - Copy the Internal Database URL

3. **Create backend service**:
   - New → Web Service
   - Connect repository
   - Root Directory: `backend`
   - Environment: Docker
   - Add environment variables (including `DATABASE_URL` from step 2)

4. **Create frontend service**:
   - New → Web Service
   - Same repository
   - Root Directory: `frontend`
   - Environment: Docker
   - Add `VITE_API_URL=<backend-url>/api`

✅ Done! Your app is live.

---

### Option 3: Docker Compose (VPS/Cloud VM)

**Time: ~10 minutes**

**Prerequisites**: VPS with Docker installed (DigitalOcean, Linode, AWS EC2, etc.)

1. **SSH into your server**:
   ```bash
   ssh user@your-server-ip
   ```

2. **Clone repository**:
   ```bash
   git clone https://github.com/yourusername/momentum.git
   cd momentum
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   nano .env  # Edit with production values
   ```
   
   Generate secrets:
   ```bash
   openssl rand -base64 32  # For JWT_SECRET
   openssl rand -base64 32  # For REFRESH_TOKEN_SECRET
   ```

4. **Start services**:
   ```bash
   docker compose up -d --build
   ```

5. **Set up reverse proxy** (nginx on host):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

6. **Enable SSL** with Let's Encrypt:
   ```bash
   certbot --nginx -d yourdomain.com
   ```

✅ Done! Your app is live.

---

## Environment Variables Quick Reference

### Backend (Required)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
JWT_SECRET=<generate with: openssl rand -base64 32>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<generate with: openssl rand -base64 32>
REFRESH_TOKEN_EXPIRES_IN=30d
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (Required)
```bash
VITE_API_URL=/api  # or https://backend-domain.com/api
VITE_ENVIRONMENT=production
```

## Pre-Deploy Checklist (30 seconds)

Run this command to validate everything is ready:

```bash
pnpm validate-deployment
```

## Post-Deploy Verification (2 minutes)

1. **Test health endpoint**: Visit `https://your-backend-domain.com/healthz`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Test frontend**: Visit your frontend URL
   - Page should load without errors

3. **Test registration**: Create a test account
   - Should succeed and redirect to login

4. **Test login**: Login with test account
   - Should succeed and show dashboard

5. **Check logs** for any errors:
   ```bash
   # Railway: View logs in dashboard
   # Render: View logs in dashboard
   # Docker: docker compose logs -f
   ```

## Troubleshooting

### Backend won't start
- Check `DATABASE_URL` is correct
- Verify all environment variables are set
- Check logs for specific error

### Frontend can't reach backend
- Verify `VITE_API_URL` is correct
- Check CORS: Ensure backend `FRONTEND_URL` matches your frontend domain
- Test backend health endpoint directly

### Database errors
- Ensure migrations ran (check logs for "Running database migrations")
- Verify database is accessible
- Check credentials in `DATABASE_URL`

## Need More Help?

- 📚 Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🔧 Environment variables: [ENV_VARS.md](./ENV_VARS.md)
- ✅ Detailed checklist: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## Platform-Specific Costs (as of 2024)

| Platform | Free Tier | Paid (Starter) |
|----------|-----------|----------------|
| Railway | 500 hrs/month, $5 credit | Pay-as-you-go (~$10-20/mo) |
| Render | Web service sleeps after 15min | $7/mo per service |
| Fly.io | 3 shared-cpu VMs | $1.94/mo per VM |
| DigitalOcean | - | $12/mo (App Platform) |
| VPS (DO/Linode) | - | $6-12/mo (512MB-1GB) |

**Recommendation**: Railway for quick start, then migrate to VPS for cost optimization if needed.

---

🚀 **Ready? Pick a platform above and deploy in under 10 minutes!**
