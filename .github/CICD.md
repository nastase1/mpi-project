# GitHub Actions CI/CD Pipeline Guide

## 📋 Overview

This project uses **GitHub Actions** for automated Continuous Integration (CI) and Continuous Deployment (CD).

## 🔄 Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:** Every Pull Request and push to `main`/`develop`

**Jobs:**
- ✅ **Backend Tests** - Build .NET API, run unit tests
- ✅ **Frontend Tests** - Lint code, build React app
- ✅ **Docker Build** - Validate Docker images build correctly
- ✅ **Integration Test** - Test full stack with docker-compose
- ✅ **Quality Gate** - Ensure all checks pass before merge

**What it does:**
1. Checks out your code
2. Sets up .NET 8.0 and Node.js 20.x
3. Runs tests and linters
4. Builds Docker images
5. Tests the complete stack integration
6. Reports results in PR

### 2. CD Pipeline (`.github/workflows/cd.yml`)

**Triggers:** Merge to `main` branch

**Jobs:**
- 📦 **Build & Push** - Build Docker images and push to GitHub Container Registry
- 🚀 **Deploy** - Deploy to production (Render/Railway/Azure)
- 📢 **Notify** - Send deployment status to team

**What it does:**
1. Builds production Docker images
2. Pushes images to GitHub Container Registry (ghcr.io)
3. Triggers deployment to cloud platform
4. Notifies team of deployment status

## 🛠️ Setup Instructions

### Step 1: Enable GitHub Actions

GitHub Actions are enabled by default in your repository. No setup needed!

### Step 2: Configure Branch Protection

Protect your `main` branch to enforce CI checks:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
4. Select required checks:
   - `Backend - Build & Test`
   - `Frontend - Build & Lint`
   - `Docker - Build & Validate`
   - `Quality Gate - All Checks Passed`

### Step 3: Configure Secrets for Deployment

For CD to work, add these secrets in **Settings** → **Secrets and variables** → **Actions**:

#### For Render Deployment:
```
RENDER_DEPLOY_HOOK_URL=https://api.render.com/deploy/srv-xxxxx?key=yyyyy
VITE_API_URL=https://your-backend.onrender.com/api/MoodEntries
```

#### For Railway Deployment:
```
RAILWAY_TOKEN=your-railway-token-here
VITE_API_URL=https://your-backend.railway.app/api/MoodEntries
```

#### For Azure Deployment:
```
AZURE_CREDENTIALS={"clientId": "...", "clientSecret": "...", ...}
VITE_API_URL=https://your-backend.azurecontainerapps.io/api/MoodEntries
```

### Step 4: Choose Your Cloud Platform

Edit `.github/workflows/cd.yml` and uncomment the deployment step for your chosen platform:

- **Render** → Uncomment lines 66-69
- **Railway** → Uncomment lines 72-76  
- **Azure** → Uncomment lines 79-89

## 📊 Viewing Pipeline Results

### In Pull Requests:
- CI checks appear at the bottom of every PR
- Click "Details" to see logs for each job
- Fix any failing checks before merging

### In Actions Tab:
- Go to **Actions** tab in GitHub
- See all workflow runs
- Click any run to see detailed logs
- Download artifacts (test results, build logs)

## 🎯 CI/CD Best Practices

### For Pull Requests:
1. ✅ Always create a branch from `main`
2. ✅ Wait for CI to pass before requesting review
3. ✅ Address any failing checks
4. ✅ Get code review approval
5. ✅ Merge using "Squash and merge"

### For Deployments:
1. ✅ Only deploy from `main` branch
2. ✅ Test locally with Docker first
3. ✅ Monitor deployment logs
4. ✅ Verify production after deploy
5. ✅ Roll back if issues occur

## 🐛 Troubleshooting

### CI Failing?

**Backend tests fail:**
```bash
# Run tests locally
cd backend/MoodTrackerAPI.Tests
dotnet test
```

**Frontend build fails:**
```bash
# Run build locally
cd frontend
npm install
npm run build
```

**Docker build fails:**
```bash
# Test Docker builds locally
docker compose build
docker compose up
```

### CD Failing?

**Image push fails:**
- Check GitHub Container Registry permissions
- Ensure `GITHUB_TOKEN` has package write access

**Deployment fails:**
- Verify secrets are configured correctly
- Check cloud platform status
- Review deployment logs in Actions tab

## 📈 Monitoring

### GitHub Actions Usage:
- Free tier: 2,000 minutes/month (public repos: unlimited)
- View usage: **Settings** → **Billing** → **Actions**

### Build Times:
- CI Pipeline: ~5-8 minutes
- CD Pipeline: ~3-5 minutes
- Total time from PR to production: ~15-20 minutes

## 🔐 Security

- ✅ Secrets are encrypted and never exposed in logs
- ✅ Docker images are scanned for vulnerabilities (optional: enable Dependabot)
- ✅ Branch protection prevents direct pushes to main
- ✅ All deployments require CI to pass

## 📝 Adding More Checks

Want to add more quality checks? Edit `.github/workflows/ci.yml`:

### Add code coverage:
```yaml
- name: Test with coverage
  run: dotnet test --collect:"XPlat Code Coverage"
  
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
```

### Add security scanning:
```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: moodtracker-backend:test
```

### Add performance tests:
```yaml
- name: Run load tests
  run: |
    npm install -g artillery
    artillery quick --count 10 --num 100 http://localhost:5162/api/MoodEntries
```

## 🎓 Learning Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Best Practices](https://docs.docker.com/build/building/best-practices/)
- [.NET Testing Guide](https://learn.microsoft.com/en-us/dotnet/core/testing/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🚀 Next Steps

1. ✅ Merge the CI/CD workflows to `main`
2. ✅ Configure branch protection rules
3. ✅ Set up deployment secrets
4. ✅ Create a Pull Request to test CI
5. ✅ Deploy to cloud platform
6. ✅ Add CI/CD badges to README
7. ✅ Document your deployment URL for team

---

**Questions?** Check the [GitHub Actions logs](../../actions) or ask your DevOps lead!
