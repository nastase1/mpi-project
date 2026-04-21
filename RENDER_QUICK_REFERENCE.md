# 🚀 Render Deployment - Quick Reference

## 📝 Services URLs (Update these after deployment)

| Service | URL |
|---------|-----|
| **Backend API** | `https://moodtracker-backend.onrender.com` |
| **Frontend** | `https://moodtracker-frontend.onrender.com` |
| **Database** | `postgresql://user:pass@dpg-xxxxx-a/moodtrackerdb` |

## 🔑 GitHub Secrets Required

Add these in **GitHub** → **Settings** → **Secrets and variables** → **Actions**:

```
VITE_API_URL=https://moodtracker-backend.onrender.com/api/MoodEntries
RENDER_BACKEND_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxxxx?key=yyyyy
RENDER_FRONTEND_DEPLOY_HOOK=https://api.render.com/deploy/srv-zzzzz?key=wwwww
```

## 🔧 Render Service Configuration

### Database (PostgreSQL)
```
Name: moodtracker-db
Database: moodtrackerdb
User: moodtracker_user
Region: Frankfurt (or closest)
Plan: Free (90 days) or $7/month
```

### Backend API
```
Name: moodtracker-backend
Image: ghcr.io/nastase1/mpi-project-backend:latest
Port: 8080
Region: Same as database

Environment Variables:
  ASPNETCORE_ENVIRONMENT=Production
  ConnectionStrings__DefaultConnection=<internal-db-url>
```

### Frontend
```
Name: moodtracker-frontend
Image: ghcr.io/nastase1/mpi-project-frontend:latest
Port: 80
Region: Same as backend

Note: VITE_API_URL must be set in GitHub Secrets
(used at Docker build time)
```

## ✅ Deployment Checklist

### Initial Setup (One-time)
- [ ] Create Render account
- [ ] Create PostgreSQL database → Copy Internal URL
- [ ] Deploy backend → Set environment variables
- [ ] Deploy frontend
- [ ] Get deploy hook URLs from both services
- [ ] Add all secrets to GitHub
- [ ] Update backend CORS with frontend URL
- [ ] Push changes to trigger deployment

### After Each Code Change
- [ ] Commit and push to feature branch
- [ ] Create PR → Wait for CI to pass
- [ ] Merge to `main`
- [ ] CD automatically deploys to Render
- [ ] Wait ~2 minutes for services to update
- [ ] Test production URLs

## 🧪 Testing Commands

```bash
# Test Backend API
curl https://moodtracker-backend.onrender.com/api/MoodEntries

# Create Test Entry
curl -X POST https://moodtracker-backend.onrender.com/api/MoodEntries \
  -H "Content-Type: application/json" \
  -d '{"mood":"Happy","note":"Test","date":"2026-04-21T10:00:00Z"}'

# Test Frontend (open in browser)
open https://moodtracker-frontend.onrender.com
```

## 🐛 Common Issues

### Backend won't start
- ✅ Check database connection string (use Internal URL)
- ✅ Verify database is running
- ✅ Check logs in Render dashboard

### Frontend API calls fail
- ✅ Verify VITE_API_URL secret is correct
- ✅ Check backend CORS includes frontend URL
- ✅ Rebuild images after changing secrets

### Services are slow/sleeping
- ✅ Free tier sleeps after 15min inactivity
- ✅ First request takes ~30s to wake up
- ✅ Upgrade to paid plan ($7/month per service) for always-on

## 📊 Monitoring

**Check Logs:**
```
Render Dashboard → Service → Logs tab
```

**View Metrics:**
```
Render Dashboard → Service → Metrics tab
- CPU usage
- Memory usage
- Request count
- Response times
```

## 💰 Pricing Reminder

| Service | Free | Paid (Always-On) |
|---------|------|------------------|
| Database | 90 days | $7/month |
| Backend | 750 hrs/mo | $7/month |
| Frontend | 750 hrs/mo | $7/month |
| **Total** | **Free 90 days** | **$21/month** |

## 🔗 Quick Links

- [Render Dashboard](https://dashboard.render.com/)
- [Full Deployment Guide](./.github/RENDER_DEPLOYMENT_GUIDE.md)
- [CI/CD Guide](./.github/CICD.md)
- [GitHub Container Registry](https://github.com/nastase1/mpi-project/pkgs/container/mpi-project-backend)

## 🆘 Need Help?

1. Check full guide: `.github/RENDER_DEPLOYMENT_GUIDE.md`
2. Check Render docs: https://render.com/docs
3. Check service logs in Render Dashboard
4. Review GitHub Actions logs for deployment issues
