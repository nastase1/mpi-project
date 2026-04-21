# 🚀 Render.com Deployment Guide

Complete step-by-step guide to deploy the Mood Tracker app to Render.com.

## 📋 Prerequisites

- ✅ GitHub account with this repository
- ✅ Render.com account (free tier available)
- ✅ Docker images pushed to GitHub Container Registry (ghcr.io)

## 🎯 Deployment Overview

You'll deploy **3 services** on Render:

1. **PostgreSQL Database** (free tier, 90 days then $7/month)
2. **Backend API** (ASP.NET Core)
3. **Frontend** (React + Nginx)

> **Note:** Render free tier services spin down after inactivity. First request takes ~30s to wake up.

---

## 📝 Part 1: Create Render Account & Set Up Database

### Step 1: Sign Up for Render

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

### Step 2: Create PostgreSQL Database

1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure database:
   - **Name:** `moodtracker-db`
   - **Database:** `moodtrackerdb` (lowercase, no spaces)
   - **User:** `moodtracker_user`
   - **Region:** Choose closest to you (e.g., Frankfurt for Europe)
   - **Plan:** Free (or paid if you need always-on)
3. Click **"Create Database"**
4. Wait 2-3 minutes for database to provision

### Step 3: Get Database Connection String

1. Click on your new database `moodtracker-db`
2. Scroll to **"Connections"** section
3. Find **"Internal Database URL"** (starts with `postgresql://`)
4. Copy this URL - you'll need it for the backend

Example format:
```
postgresql://moodtracker_user:password@dpg-xxxxx-a/moodtrackerdb
```

---

## 📝 Part 2: Deploy Backend API

### Step 1: Create Backend Web Service

1. From Dashboard, click **"New +"** → **"Web Service"**
2. Choose **"Deploy an existing image from a registry"**
3. Click **"Next"**

### Step 2: Configure Backend Service

**Image URL:**
```
ghcr.io/nastase1/mpi-project-backend:latest
```

**Basic Settings:**
- **Name:** `moodtracker-backend`
- **Region:** Same as database (e.g., Frankfurt)
- **Plan:** Free (or Starter if you need always-on)

**Environment Variables:** Click **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__DefaultConnection` | `your-postgres-internal-url` |

> **Important:** Replace `your-postgres-internal-url` with the Internal Database URL from Step 3 above.

**Advanced Settings:**
- **Port:** `8080` (ASP.NET Core default)
- **Health Check Path:** `/api/MoodEntries` (optional but recommended)

### Step 3: Deploy Backend

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Render will pull your Docker image and start it

### Step 4: Verify Backend is Running

1. Once deployed, find your backend URL (e.g., `https://moodtracker-backend.onrender.com`)
2. Test the API:
   ```
   https://moodtracker-backend.onrender.com/api/MoodEntries
   ```
3. You should see `[]` (empty array) if successful

---

## 📝 Part 3: Deploy Frontend

### Step 1: Create Frontend Web Service

1. From Dashboard, click **"New +"** → **"Web Service"**
2. Choose **"Deploy an existing image from a registry"**
3. Click **"Next"**

### Step 2: Configure Frontend Service

**Image URL:**
```
ghcr.io/nastase1/mpi-project-frontend:latest
```

**Basic Settings:**
- **Name:** `moodtracker-frontend`
- **Region:** Same as backend
- **Plan:** Free

**Environment Variables:** 

> **Note:** The frontend environment variable must be set at **build time**, not runtime. We'll rebuild the image with the correct API URL.

For now, just create the service with these settings:
- **Port:** `80` (Nginx default)

### Step 3: Deploy Frontend

1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. Find your frontend URL (e.g., `https://moodtracker-frontend.onrender.com`)

---

## 📝 Part 4: Connect Frontend to Backend

Now we need to rebuild the frontend image with the correct backend API URL.

### Step 1: Add Backend URL to GitHub Secrets

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://moodtracker-backend.onrender.com/api/MoodEntries`
   
   *(Replace with your actual backend URL)*

5. Click **"Add secret"**

### Step 2: Update Backend CORS Settings

Your backend needs to allow requests from the frontend domain.

Edit `backend/MoodTrackerAPI/Program.cs` and update the CORS policy:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://moodtracker-frontend.onrender.com"  // Add your frontend URL
        )
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});
```

### Step 3: Trigger New Deployment

1. Commit the CORS change:
   ```bash
   git add backend/MoodTrackerAPI/Program.cs
   git commit -m "feat: add Render frontend to CORS policy"
   git push
   ```

2. The CD pipeline will automatically:
   - Build new Docker images with correct environment variables
   - Push to GitHub Container Registry
   - Trigger Render deployment (once we enable it)

---

## 📝 Part 5: Enable Automatic Deployments

### Step 1: Get Render Deploy Hook URLs

For **Backend:**
1. Go to Render Dashboard → `moodtracker-backend`
2. Click **"Settings"** tab
3. Scroll to **"Deploy Hook"**
4. Copy the URL (looks like: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`)

For **Frontend:**
1. Go to Render Dashboard → `moodtracker-frontend`
2. Click **"Settings"** tab
3. Copy the Deploy Hook URL

### Step 2: Add Deploy Hooks to GitHub Secrets

1. Go to GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

   **Name:** `RENDER_BACKEND_DEPLOY_HOOK`
   **Value:** `https://api.render.com/deploy/srv-backend-xxxxx?key=yyyyy`

   **Name:** `RENDER_FRONTEND_DEPLOY_HOOK`
   **Value:** `https://api.render.com/deploy/srv-frontend-xxxxx?key=zzzzz`

### Step 3: Update CD Workflow

The CD workflow needs to be updated to use both deploy hooks. I'll do this automatically for you.

---

## 📝 Part 6: Test Your Deployment

### Test Backend API

1. Open browser to: `https://moodtracker-backend.onrender.com/api/MoodEntries`
2. Should return: `[]` (empty array)
3. Status code: 200 OK

### Test Frontend App

1. Open: `https://moodtracker-frontend.onrender.com`
2. You should see the Mood Tracker interface
3. Try adding a mood entry:
   - Click on the jar
   - Select mood (Happy/Sad/Neutral/Anxious)
   - Add note (optional)
   - Save
4. Check backend: `https://moodtracker-backend.onrender.com/api/MoodEntries`
5. Should see your new entry!

### Test Full Integration

```bash
# Test API directly
curl https://moodtracker-backend.onrender.com/api/MoodEntries

# Create test entry
curl -X POST https://moodtracker-backend.onrender.com/api/MoodEntries \
  -H "Content-Type: application/json" \
  -d '{"mood":"Happy","note":"Testing from curl!","date":"2026-04-21T10:00:00Z"}'
```

---

## 🔧 Troubleshooting

### Backend Issues

**"Application startup failed"**
- Check logs: Render Dashboard → Backend → Logs
- Verify database connection string is correct
- Ensure database is running

**"Health check failing"**
- Check if API is responding: `curl https://your-backend.onrender.com/api/MoodEntries`
- Verify port is `8080`
- Check ASPNETCORE_ENVIRONMENT is set

**"Database connection error"**
- Use **Internal Database URL** (not External)
- Check format: `postgresql://user:pass@host/dbname`
- Verify database is in same region

### Frontend Issues

**"502 Bad Gateway"**
- Service is starting up (wait 30s on free tier)
- Check logs in Render Dashboard

**"API calls failing / CORS errors"**
- Verify VITE_API_URL secret is set correctly
- Check backend CORS policy includes frontend URL
- Rebuild images after changing secrets

**"Blank page / React errors"**
- Check browser console (F12)
- Verify API URL is correct
- Check frontend logs in Render

### Database Issues

**"Connection refused"**
- Database is suspended (free tier limitation)
- Upgrade to paid plan ($7/month) for always-on

**"Too many connections"**
- Free tier has connection limits
- Close old connections or upgrade plan

---

## 💰 Render Pricing

| Service | Free Tier | Paid Plan |
|---------|-----------|-----------|
| **PostgreSQL** | 90 days free trial | $7/month (256MB RAM) |
| **Web Service** | 750 hours/month, sleeps after inactivity | $7/month (512MB RAM, always-on) |
| **Bandwidth** | 100GB/month | Unlimited |

**Total for Always-On:** ~$21/month (1 DB + 2 services)

**Free Tier Limitations:**
- Services sleep after 15 minutes of inactivity
- First request takes ~30s to wake up
- Database free for 90 days

---

## 🎓 Grade Criteria Impact

**DevOps Engineer (1.0p):**
- ✅ 0.25p: Deploy automat (CD) în Cloud la merge pe main
- ✅ 0.25p: Monitoring & Logging (Render provides built-in logs)

**Total:** 0.50p from deployment + monitoring

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Deploy Docker Images on Render](https://render.com/docs/deploy-an-image)
- [Render PostgreSQL Guide](https://render.com/docs/databases)
- [Render Environment Variables](https://render.com/docs/environment-variables)

---

## ✅ Deployment Checklist

Use this checklist to track your progress:

- [ ] Create Render account
- [ ] Create PostgreSQL database
- [ ] Copy database connection string
- [ ] Deploy backend service
- [ ] Configure backend environment variables
- [ ] Verify backend is accessible
- [ ] Deploy frontend service
- [ ] Add VITE_API_URL to GitHub secrets
- [ ] Update backend CORS settings
- [ ] Get Render deploy hooks
- [ ] Add deploy hooks to GitHub secrets
- [ ] Enable automatic deployments in CD workflow
- [ ] Test full application flow
- [ ] Monitor logs for any errors
- [ ] Document production URLs

---

**Need help?** Check the [CICD.md](./CICD.md) for general CI/CD troubleshooting.
