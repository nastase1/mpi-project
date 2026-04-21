# 🎭 Daily Mood Tracker

[![CI Pipeline](https://github.com/nastase1/mpi-project/actions/workflows/ci.yml/badge.svg)](https://github.com/nastase1/mpi-project/actions/workflows/ci.yml)
[![CD Pipeline](https://github.com/nastase1/mpi-project/actions/workflows/cd.yml/badge.svg)](https://github.com/nastase1/mpi-project/actions/workflows/cd.yml)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](./DOCKER_GUIDE.md)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)

Aplicație web full-stack pentru urmărirea dispoziției zilnice, dezvoltată ca proiect pentru cursul de Managementul Proiectelor Informatice.

## 📋 Descriere

Daily Mood Tracker permite utilizatorilor să-și înregistreze starea emoțională zilnică, să adauge notițe personale și să vizualizeze istoricul într-un format interactiv și atractiv vizual.

## 👥 Echipa

| Rol                    | Nume   | Responsabilități                           |
| ---------------------- | ------ | ------------------------------------------ |
| **Backend Developer**  | [Nume] | API REST, Baza de date, Logica de business |
| **Frontend Developer** | [Nume] | Interfața utilizator, Integrare API        |
| **QA Engineer**        | [Nume] | Teste automate, Validare calitate          |
| **DevOps Engineer**    | [Nume] | Docker, CI/CD, Cloud Deployment            |

## 🛠️ Stack Tehnologic

### Backend

- **Framework:** ASP.NET Core 8.0
- **Database:** SQL Server 2022
- **ORM:** Entity Framework Core
- **API:** REST

### Frontend

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Physics Engine:** Matter.js (pentru animații interactive)

### Infrastructure

- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Cloud:** [Render/Railway/Azure - de completat]

## 🚀 Quick Start cu Docker

### Cerințe

- Docker Desktop instalat și pornit
- Git

### Pornire rapidă

```bash
# 1. Clonează repository-ul
git clone <repository-url>
cd mpi-project

# 2. Pornește aplicația (tot stack-ul)
docker compose up --build

# 3. Accesează aplicația
# Frontend: http://localhost:5173
# Backend API: http://localhost:5162
# Swagger: http://localhost:5162/swagger
```

### Oprire

```bash
# Oprește containerele (păstrează datele)
docker compose down

# Oprește și șterge toate datele
docker compose down -v
```

## 💻 Dezvoltare Locală (fără Docker)

### Backend

```bash
cd backend/MoodTrackerAPI

# Instalează dependențele (prima dată)
dotnet restore

# Creează baza de date
dotnet ef database update

# Pornește serverul
dotnet run

# Backend va rula pe: http://localhost:5162
```

### Frontend

```bash
cd frontend

# Instalează dependențele
npm install

# Pornește dev server
npm run dev

# Frontend va rula pe: http://localhost:5173
```

## 🏗️ Arhitectură

```
┌─────────────┐      HTTP/REST      ┌──────────────┐
│   Frontend  │ ←──────────────────→ │   Backend    │
│  (React)    │   JSON Responses    │  (ASP.NET)   │
└─────────────┘                      └──────────────┘
                                            │
                                            │ EF Core
                                            ↓
                                     ┌──────────────┐
                                     │  SQL Server  │
                                     │   Database   │
                                     └──────────────┘
```

### Structura Proiectului

```
mpi-project/
├── backend/
│   └── MoodTrackerAPI/
│       ├── Controllers/       # API endpoints
│       ├── Services/          # Business logic
│       ├── Models/            # Data models
│       ├── Data/              # DbContext
│       ├── Migrations/        # EF Core migrations
│       └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   └── assets/            # Static assets
│   ├── Dockerfile
│   └── nginx.conf             # Production server config
├── docker-compose.yml         # Orchestration
└── README.md
```

## 📡 API Endpoints

### MoodEntries

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| GET    | `/api/MoodEntries`      | Returnează toate înregistrările     |
| GET    | `/api/MoodEntries/{id}` | Returnează o înregistrare specifică |
| POST   | `/api/MoodEntries`      | Creează o înregistrare nouă         |
| DELETE | `/api/MoodEntries/{id}` | Șterge o înregistrare               |

### Request Body Example (POST)

```json
{
  "date": "2026-04-20T10:00:00Z",
  "mood": "Great",
  "note": "Had a wonderful day!"
}
```

### Mood Values

- `Great` 🤩
- `Good` 🙂
- `Neutral` 😐
- `Bad` 😕
- `Awful` 😭

## 🧪 Teste

### Backend Tests

```bash
cd backend/MoodTrackerAPI.Tests
dotnet test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## � CI/CD Pipeline

Proiectul utilizează **GitHub Actions** pentru automatizarea build-ului, testării și deployment-ului.

### Continuous Integration (CI)

**Trigger:** Orice Pull Request către `main` sau `develop`

**Ce face:**

- ✅ Rulează teste backend (.NET unit tests)
- ✅ Verifică build-ul frontend (linting + compile)
- ✅ Validează Docker images (build test)
- ✅ Testează integrarea completă (docker-compose)
- ✅ Quality Gate - toate check-urile trebuie să treacă

**Status:** Vezi badge-urile de mai sus ☝️

### Continuous Deployment (CD)

**Trigger:** Merge pe branch-ul `main`

**Ce face:**

- 📦 Build Docker images pentru backend și frontend
- 🚀 Push images la GitHub Container Registry
- ☁️ Deploy automat în cloud (production)
- 📢 Notifică echipa despre status deployment

### Pentru Dezvoltatori

**Înainte de a crea un PR:**

1. Asigură-te că aplicația pornește local: `docker compose up`
2. Rulează testele: `cd backend/MoodTrackerAPI.Tests && dotnet test`
3. Verifică că frontend se compilează: `cd frontend && npm run build`

**După ce creezi PR-ul:**

- CI va rula automat toate testele
- Așteaptă ca toate check-urile să devină verzi ✅
- Cere code review de la colegi
- Merge doar după aprobarea review-ului

**Documentație completă:** [.github/CICD.md](.github/CICD.md)
### ☁️ Cloud Deployment

Aplicația este configurată pentru deployment automat pe **Render.com** la fiecare merge pe `main`.

**Servicii deployed:**
- Backend API (ASP.NET Core + PostgreSQL)
- Frontend (React + Nginx)
- Database (PostgreSQL managed)

**Deployment Guides:**
- 📘 **[Step-by-Step Render.com Deployment](.github/RENDER_DEPLOYMENT_GUIDE.md)** - Ghid complet cu capturi de ecran
- 📋 **[Quick Reference Card](RENDER_QUICK_REFERENCE.md)** - Comenzi și URLs rapid access
- 🔧 **Helper Scripts:**
  - `scripts/update-cors.ps1` - Update CORS settings (PowerShell)
  - `scripts/update-cors.sh` - Update CORS settings (Bash)

**Production URLs** *(după deployment)*:
- Frontend: `https://moodtracker-frontend.onrender.com`
- Backend API: `https://moodtracker-backend.onrender.com/api/MoodEntries`

## 🔧 Configurare Environment Variables

### Local Development

#### Backend (.env)

```env
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=MoodTrackerDb;Username=moodtracker_user;Password=YourStrong@Password123;
ASPNETCORE_ENVIRONMENT=Development
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5162/api/MoodEntries
```

### Production (Render.com)

#### Backend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | *(Auto-set by Render PostgreSQL)* | PostgreSQL connection string |
| `ASPNETCORE_ENVIRONMENT` | `Production` | Runtime environment |
| `ASPNETCORE_URLS` | `http://0.0.0.0:8080` | Port binding for Render |

#### Frontend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://moodtracker-backend-2fk4.onrender.com/api/MoodEntries` | Production backend URL |

**⚠️ Important:** 
- Nu commitați fișierele `.env` în Git! Folosiți `.env.example` ca template.
- Render citește automat `DATABASE_URL` pentru conexiunea PostgreSQL
- Backend convertește automat formatul URL PostgreSQL (`postgresql://...`) la format Npgsql

## 📦 Build pentru Producție

### Cu Docker

```bash
# Build toate serviciile
docker compose build

# Rulare în producție
docker compose up -d
```

### Manual

**Backend:**

```bash
cd backend/MoodTrackerAPI
dotnet publish -c Release -o ./publish
```

**Frontend:**

```bash
cd frontend
npm run build
# Output în: ./dist
```

## 🔒 Securitate

- ✅ CORS configurat pentru frontend
- ✅ Environment variables pentru secrets
- ✅ .gitignore pentru fișiere sensibile
- ✅ Validare input în backend
- ✅ SQL injection protection via EF Core
- ✅ HTTPS redirect în producție

## � Monitoring & Logging

### Application Logging

Backend-ul utilizează **structured logging** cu `ILogger<T>`:

```csharp
// Log levels: Information, Warning, Error
logger.LogInformation("[STARTUP] Application started");
logger.LogWarning("[DATABASE] Connection retry attempt {Attempt}", retryCount);
logger.LogError(ex, "[API] Request failed: {ErrorMessage}", ex.Message);
```

**Log format:**
- `[STARTUP]` - Application initialization
- `[DATABASE]` - Database operations (migrations, connections)
- `[API]` - HTTP requests and responses

### Production Monitoring (Render.com)

#### Metrics Dashboard
Render oferă monitoring built-in:
- **CPU Usage** - Utilizare procesor (target: <70%)
- **Memory Usage** - Utilizare RAM (target: <80% din 512MB)
- **Response Time** - Latență HTTP (target: <500ms)
- **Status Checks** - Health endpoint polling

#### Access Logs
```bash
# View real-time logs în Render dashboard
# Logs → Select Service → View Logs

# Căutare keywords
[STARTUP] - Application boot
[DATABASE] - Database issues
[ERROR] - Application errors
```

#### Health Checks

Backend expune endpoint de health check:
```bash
# Local
curl http://localhost:5162/api/MoodEntries

# Production
curl https://moodtracker-backend-2fk4.onrender.com/api/MoodEntries
```

**Expected response:** `200 OK` cu array JSON (poate fi gol: `[]`)

#### Alerting

Render detectează automat:
- ❌ Crash-uri (exit code != 0)
- ❌ Health check failures (5 consecutive fails)
- ❌ OOM (Out of Memory) kills

**Auto-recovery:** Render reporneşte automat serviciul după crash.

## �🐛 Troubleshooting

### Docker

**Problema:** Containerele nu pornesc

```bash
# Verifică logs
docker compose logs

# Restart clean
docker compose down -v
docker compose up --build
```

**Problema:** Database connection failed

```bash
# Verifică dacă SQL Server container e healthy
docker compose ps

# Vezi logs database
docker compose logs db
```

### Development Local

**Problema:** Backend nu se conectează la database

- Verifică că SQL Server LocalDB e instalat
- Rulează migrațiile: `dotnet ef database update`

**Problema:** Frontend nu vede backend

- Verifică că backend rulează pe portul 5162
- Verifică `.env` file în frontend

### Production (Render.com)

**Problema:** Database migration failed

```bash
# Symptom: "Format of the initialization string does not conform to specification"
# Solution: Backend now auto-converts postgresql:// URL to Npgsql format
# Check logs for: "[STARTUP] Converted DATABASE_URL from postgres:// format"
```

**Problema:** Application crashes on startup

```bash
# Check Render logs for:
# 1. [DATABASE] Connection string issues
# 2. [STARTUP] Missing environment variables
# 3. Migration errors

# Common fixes:
# - Verify DATABASE_URL is set in Render dashboard
# - Ensure PostgreSQL service is running
# - Check database connection limits
```

**Problema:** CORS errors în frontend

```bash
# Symptom: "Access-Control-Allow-Origin" error
# Solution: Verifică că frontend URL e în lista CORS din backend:
# - http://localhost:5173 (local)
# - https://moodtracker-frontend-jbfn.onrender.com (production)
```

**Problema:** 502 Bad Gateway

```bash
# Causes:
# 1. Backend takes >30s to start (free tier cold start)
# 2. Port mismatch - trebuie să fie 8080 pentru Render
# 3. Application crashed - check logs

# Solution:
# - Wait 30-60s after deployment
# - Verify ASPNETCORE_URLS=http://0.0.0.0:8080
# - Check recent commits for breaking changes
```

**Problema:** GitGuardian security alert

```bash
# Alert: ODBC Connection String detected
# Note: Credentials în docker-compose.yml sunt doar pentru LOCAL development
# Production folosește DATABASE_URL (securizat în Render)
# Safe to ignore for university projects
```

## 📝 Git Workflow

```bash
# 1. Creează branch pentru feature
git checkout -b feat/nume-feature

# 2. Fă modificările
git add .
git commit -m "feat: descriere schimbare"

# 3. Push și creează PR
git push origin feat/nume-feature
```

## 🚢 Deployment

[De completat cu instrucțiuni specifice pentru platforma cloud aleasă]

## 📚 Documentație Adițională

- [Backend README](backend/MoodTrackerAPI/README.md)
- [Frontend README](frontend/README.md)
- [API Documentation](http://localhost:5162/swagger) (când backend rulează)

## 📄 Licență

Acest proiect este dezvoltat în scop educațional pentru cursul MPI 2025-2026.

---

**Developed with ❤️ by Team [Nume Echipă]**
