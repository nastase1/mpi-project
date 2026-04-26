# 🎭 Daily Mood Tracker

[![CI Pipeline](https://github.com/nastase1/mpi-project/actions/workflows/ci.yml/badge.svg)](https://github.com/nastase1/mpi-project/actions/workflows/ci.yml)
[![CD Pipeline](https://github.com/nastase1/mpi-project/actions/workflows/cd.yml/badge.svg)](https://github.com/nastase1/mpi-project/actions/workflows/cd.yml)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](./DOCKER_GUIDE.md)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

> **Premium Interactive SaaS** pentru urmărirea dispoziției zilnice și mindfulness, dezvoltată ca proiect pentru cursul de Managementul Proiectelor Informatice (MPI).

---

## 📑 Cuprins

- [📋 Descriere](#-descriere)
- [👥 Echipa](#-echipa)
- [🛠️ Stack Tehnologic](#️-stack-tehnologic)
- [🚀 Quick Start cu Docker](#-quick-start-cu-docker)
- [💻 Dezvoltare Locală](#-dezvoltare-locală-fără-docker)
- [🏗️ Arhitectură](#️-arhitectură)
- [📡 API Endpoints](#-api-endpoints)
- [🧪 Teste](#-teste)
- [🔧 CI/CD Pipeline](#-cicd-pipeline)
- [🔧 Configurare Environment Variables](#-configurare-environment-variables)
- [📊 Monitoring & Logging](#-monitoring--logging)
- [🐛 Troubleshooting](#-troubleshooting)
- [📝 Git Workflow](#-git-workflow)
- [🚢 Deployment & Production](#-deployment--production)
- [📚 Documentație Adițională](#-documentație-adițională)

---

## 📋 Descriere

Daily Mood Tracker este o aplicație web full-stack de tip **Premium Interactive SaaS** pentru urmărirea dispoziției zilnice și mindfulness. Aplicația transformă emoțiile în entități fizice interactive folosind un motor de fizică 2D, creând un jurnal de sănătate mentală tactil și captivant.

### ✨ Caracteristici Principale

| Feature                    | Descriere                                                                                                                                                                     | Tehnologie                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **🫙 Mood Jar Interactiv** | Reprezentare dinamică a stărilor emoționale ca sfere fizice cu masă, fricțiune și elasticitate personalizate. Utilizatorii pot trage, arunca și interacționa cu emoțiile lor. | **Matter.js** (2D Physics Engine) + Audio feedback          |
| **🎨 Spatial UI Design**   | Interfață inspirată din VisionOS/macOS cu straturi translucide, umbre soft și gradient-uri mesh ambientale.                                                                   | **Tailwind CSS** (glassmorphism, backdrop-blur)             |
| **📅 History Heatmap**     | Calendar grid inteligent care calculează și vizualizează dispoziția dominantă pentru fiecare zi.                                                                              | Click pentru detalii, filtrare pe tip de mood               |
| **🧭 Floating Navbar**     | Bară de navigație centrală în stil "pill" care se adaptează perfect la toate viewport-urile.                                                                                  | Micro-interacțiuni responsive                               |
| **⚡ Real-time CRUD**      | Management complet al intrărilor emoționale (Creare, Citire, Ștergere).                                                                                                       | Sincronizare instant între physics engine, UI și PostgreSQL |
| **🔄 Auto-migration**      | Baza de date se creează/actualizează automat la pornire.                                                                                                                      | Entity Framework Core Migrations                            |

## 👥 Echipa

| Rol                    | Nume             | Responsabilități                           |
| ---------------------- | ---------------- | ------------------------------------------ |
| **Backend Developer**  | [Petcu Gabriela] | API REST, Baza de date, Logica de business |
| **Frontend Developer** | [Negoiță Andrei] | Interfața utilizator, Integrare API        |
| **QA Engineer**        | [Milica Andreea] | Teste automate, Validare calitate          |
| **DevOps Engineer**    | [Năstase Teodor] | Docker, CI/CD, Cloud Deployment            |

## 🛠️ Stack Tehnologic

### Backend

| Categorie          | Tehnologie                | Scop în Proiect                                               |
| ------------------ | ------------------------- | ------------------------------------------------------------- |
| **Framework**      | **ASP.NET Core 8.0**      | Web API, Dependency Injection, Middleware pipeline            |
| **Database**       | **PostgreSQL 16**         | Relational database cu suport pentru timestamp with time zone |
| **ORM**            | **Entity Framework Core** | Database migrations, LINQ queries, SQL injection protection   |
| **API**            | **REST**                  | Stateless communication, JSON payloads, HTTP status codes     |
| **Authentication** | **CORS**                  | Cross-Origin Resource Sharing pentru frontend                 |
| **Logging**        | **ILogger<T>**            | Structured logging cu log levels (Info, Warning, Error)       |
| **Validation**     | **Data Annotations**      | Model validation, error handling                              |

### Frontend

| Categorie       | Tehnologie         | Scop în Proiect                                                 |
| --------------- | ------------------ | --------------------------------------------------------------- |
| **Framework**   | **React 18**       | Functional components, hooks (useState, useEffect, useRef)      |
| **Language**    | **TypeScript**     | Type safety, IntelliSense, compile-time error detection         |
| **Build Tool**  | **Vite**           | Fast HMR, optimized production builds, modern ES modules        |
| **Styling**     | **Tailwind CSS**   | Utility-first styling, glassmorphism effects, custom animations |
| **Routing**     | **React Router 6** | Client-side routing, protected routes, navigation state         |
| **Physics**     | **Matter.js**      | 2D rigid body physics engine pentru Mood Jar simulation         |
| **HTTP Client** | **Fetch API**      | Asynchronous REST API communication cu backend                  |

### Infrastructure

| Categorie            | Tehnologie                   | Scop în Proiect                                                            |
| -------------------- | ---------------------------- | -------------------------------------------------------------------------- |
| **Containerization** | **Docker & Docker Compose**  | Multi-stage builds, health checks, named volumes, custom network           |
| **CI/CD**            | **GitHub Actions**           | Automated testing, linting, build validation, deployment                   |
| **Cloud Platform**   | **Render.com**               | PostgreSQL managed database, Web Service (backend), Static Site (frontend) |
| **Version Control**  | **Git & GitHub**             | Branch protection, PR workflow, code review, issue tracking                |
| **Monitoring**       | **Render Metrics + ILogger** | CPU/Memory tracking, structured application logs, health checks            |

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

### System Architecture

```
┌─────────────────┐    HTTP/REST     ┌──────────────────┐    EF Core    ┌────────────────┐
│   Frontend      │ ←─────────────→  │    Backend       │ ←──────────→  │   PostgreSQL   │
│  (React SPA)    │  JSON/CORS       │  (ASP.NET API)   │  Migrations   │   Database     │
└─────────────────┘                  └──────────────────┘               └────────────────┘
      │                                       │                                  │
      │ Matter.js Physics                    │ ILogger<T>                       │ ACID
      │ Tailwind Styling                     │ CORS Middleware                  │ Transactions
      │ React Router                         │ DI Container                     │ Constraints
      └─────────────────────────────────────────────────────────────────────────┘
                              Docker Compose Network (moodtracker-network)
```

### Layered Architecture (Backend)

```
Controllers/          # HTTP Endpoints
    ├─ MoodEntriesController.cs  → Expune REST API, validare input, status codes

Services/            # Business Logic
    └─ MoodEntryService.cs       → CRUD operations, data transformation

Models/              # Data Entities
    └─ MoodEntry.cs              → Entity properties, data annotations

Data/                # Database Context
    └─ AppDbContext.cs           → EF Core configuration, DbSet<T>

Migrations/          # Database Schema
    └─ {timestamp}_*.cs          → Auto-generated schema changes
```

### Component Architecture (Frontend)

```
src/
├── pages/                    # Route Components
│   ├── Welcome.tsx           → Landing page cu onboarding
│   ├── MoodJar.tsx           → Core feature (physics simulation)
│   └── History.tsx           → Calendar heatmap + filtering
│
├── components/               # Reusable UI
│   └── Navbar.tsx            → Floating navigation bar
│
├── App.tsx                   → Router configuration, global layout
├── main.tsx                  → React DOM entry point
└── index.css                 → Global styles, Tailwind imports
```

### Docker Architecture

```yaml
services:
  db:               # PostgreSQL 16 Alpine
    └─ Health: pg_isready
    └─ Volume: moodtracker-data (persistent)

  backend:          # ASP.NET Core 8.0
    └─ Depends: db (health check)
    └─ Port: 5162 → 8080
    └─ Auto-migration on startup

  frontend:         # React + Nginx
    └─ Build: Vite production
    └─ Port: 5173 → 80
    └─ Proxy: API calls to backend
```

### Structura Proiectului

```
mpi-project/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Continuous Integration pipeline
│   │   └── cd.yml                    # Continuous Deployment pipeline
│   ├── CICD.md                       # CI/CD documentation
│   └── RENDER_DEPLOYMENT_GUIDE.md    # Cloud deployment guide
│
├── backend/
│   ├── MoodTrackerAPI/
│   │   ├── Controllers/
│   │   │   └── MoodEntriesController.cs    # REST API endpoints
│   │   ├── Services/
│   │   │   └── MoodEntryService.cs         # Business logic layer
│   │   ├── Models/
│   │   │   └── MoodEntry.cs                # Entity model (Id, Date, Mood, Note)
│   │   ├── Data/
│   │   │   └── AppDbContext.cs             # EF Core DbContext
│   │   ├── Migrations/
│   │   │   └── *_InitialCreatePostgreSQL.cs # Database schema
│   │   ├── Properties/
│   │   │   └── launchSettings.json         # Development ports
│   │   ├── appsettings.json                # Configuration
│   │   ├── Program.cs                      # Application startup, DI, logging
│   │   ├── Dockerfile                      # Multi-stage build (SDK → Runtime)
│   │   └── MoodTrackerAPI.csproj           # Dependencies (EF, Npgsql)
│   │
│   └── MoodTrackerAPI.Tests/
│       ├── MoodEntryServiceTests.cs        # xUnit test suite
│       └── MoodTrackerAPI.Tests.csproj     # Test dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Welcome.tsx          # Landing page
│   │   │   ├── MoodJar.tsx          # Interactive physics simulation
│   │   │   └── History.tsx          # Calendar heatmap
│   │   ├── components/
│   │   │   └── Navbar.tsx           # Navigation bar
│   │   ├── assets/                  # Static images, fonts
│   │   ├── App.tsx                  # Root component, Router
│   │   ├── main.tsx                 # React DOM entry
│   │   └── index.css                # Global styles
│   ├── public/                      # Static assets
│   ├── Dockerfile                   # Vite build + Nginx serve
│   ├── nginx.conf                   # Production server config
│   ├── package.json                 # NPM dependencies
│   ├── vite.config.ts               # Build configuration
│   ├── tailwind.config.js           # Tailwind customization
│   └── tsconfig.json                # TypeScript compiler options
│
├── docker-compose.yml               # Orchestration (db, backend, frontend)
├── .gitignore                       # Ignored files (.env, node_modules, bin/, obj/)
└── README.md                        # This file
```

## 📡 API Endpoints

### MoodEntries Controller

| Method | Endpoint                | Descriere                                                         | Status Codes                 |
| ------ | ----------------------- | ----------------------------------------------------------------- | ---------------------------- |
| GET    | `/api/MoodEntries`      | Returnează toate înregistrările (ordonate descrescător după dată) | 200 OK                       |
| GET    | `/api/MoodEntries/{id}` | Returnează o înregistrare specifică după ID (Guid)                | 200 OK / 404 NotFound        |
| POST   | `/api/MoodEntries`      | Creează o înregistrare nouă                                       | 201 Created / 400 BadRequest |
| DELETE | `/api/MoodEntries/{id}` | Șterge o înregistrare după ID                                     | 204 NoContent / 404 NotFound |

### Request Body Example (POST)

```json
{
  "date": "2026-04-20T10:00:00Z",
  "mood": "great",
  "note": "Had a wonderful day!"
}
```

### Mood Values (Case-Insensitive)

| Value     | Emoji | Descriere                                 |
| --------- | ----- | ----------------------------------------- |
| `great`   | 🤩    | Exceptional mood - peak happiness         |
| `good`    | 🙂    | Positive mood - feeling content           |
| `neutral` | 😐    | Balanced mood - neither good nor bad      |
| `bad`     | 😕    | Negative mood - feeling down              |
| `awful`   | 😭    | Very negative mood - significant distress |

### Validări Backend

Backend-ul aplică următoarele validări:

| Câmp     | Validare                                                        | Error Response                                 |
| -------- | --------------------------------------------------------------- | ---------------------------------------------- |
| **mood** | Required, trebuie să fie unul din: great/good/neutral/bad/awful | 400 BadRequest: "Invalid mood value"           |
| **date** | Required, nu poate fi în viitor                                 | 400 BadRequest: "Date cannot be in the future" |
| **note** | Optional, max 500 caractere                                     | 400 BadRequest: "Note too long"                |
| **id**   | Must be valid Guid format                                       | 400 BadRequest: "Invalid ID format"            |

**Protecție împotriva SQL Injection:** Toate query-urile folosesc EF Core parametrizat.

**CORS Policy:** Backend permite request-uri doar de la:

- `http://localhost:5173` (dev)
- `http://localhost:3000` (alternative dev)
- `https://moodtracker-frontend-jbfn.onrender.com` (production)

## 🧪 Teste

### Backend Tests (xUnit + EF Core InMemory)

```bash
cd backend/MoodTrackerAPI.Tests
dotnet test --verbosity normal
```

**Test Coverage:**

- ✅ `GetAllMoodEntries_ReturnsAllEntries` - Verifică returnarea tuturor înregistrărilor
- ✅ `GetMoodEntryById_ReturnsEntry_WhenExists` - Verifică returnarea după ID valid
- ✅ `GetMoodEntryById_ReturnsNull_WhenNotFound` - Verifică comportament pentru ID inexistent
- ✅ `AddMoodEntry_AddsSuccessfully` - Verifică crearea cu date valide
- ✅ `DeleteMoodEntry_DeletesSuccessfully` - Verifică ștergerea după ID valid
- ✅ `DeleteMoodEntry_ReturnsFalse_WhenNotFound` - Verifică comportament pentru ștergere ID inexistent

**Arhitectură teste:**

- Folosește `EF Core InMemory Database` pentru izolare
- Setup/cleanup automat în fiecare test
- Mock data pentru scenarii realiste
- Testează separarea Controller → Service → Data

### Frontend Tests

```bash
cd frontend
npm run test
```

**Test suites:**

- Component rendering tests
- User interaction simulations
- API integration mocks

### Integration Tests (Docker)

```bash
# Test complet al stack-ului
docker compose up --build

# Verifică health
curl http://localhost:5162/api/MoodEntries  # Backend
curl http://localhost:5173                   # Frontend
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

**Production URLs** _(după deployment)_:

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

| Variable                 | Value                             | Description                  |
| ------------------------ | --------------------------------- | ---------------------------- |
| `DATABASE_URL`           | _(Auto-set by Render PostgreSQL)_ | PostgreSQL connection string |
| `ASPNETCORE_ENVIRONMENT` | `Production`                      | Runtime environment          |
| `ASPNETCORE_URLS`        | `http://0.0.0.0:8080`             | Port binding for Render      |

#### Frontend Environment Variables

| Variable       | Value                                                           | Description            |
| -------------- | --------------------------------------------------------------- | ---------------------- |
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

### Branch Strategy

```bash
main              # Protected - Production-ready code
  ├── develop     # Integration branch (optional)
  ├── feat/*      # New features
  ├── fix/*       # Bug fixes
  └── docs/*      # Documentation updates
```

### Development Workflow

```bash
# 1. Creează branch pentru feature
git checkout -b feat/nume-feature

# 2. Fă modificările și commit-uri semantice
git add .
git commit -m "feat: add mood filtering by date range"

# 3. Push branch și creează Pull Request
git push origin feat/nume-feature

# 4. Așteaptă Code Review și CI checks ✅
# 5. Merge după aprobare
```

### Commit Message Convention

| Type        | Folosire         | Exemple                                            |
| ----------- | ---------------- | -------------------------------------------------- |
| `feat:`     | New feature      | `feat: add mood statistics chart`                  |
| `fix:`      | Bug fix          | `fix: resolve timezone issue in date picker`       |
| `docs:`     | Documentation    | `docs: update API endpoint examples`               |
| `style:`    | Formatting       | `style: fix indentation in MoodJar.tsx`            |
| `refactor:` | Code restructure | `refactor: extract validation to separate service` |
| `test:`     | Add/update tests | `test: add unit tests for MoodEntryService`        |
| `chore:`    | Maintenance      | `chore: update dependencies`                       |

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested locally with `docker compose up`
- [ ] All unit tests passing
- [ ] CI pipeline successful

## Closes

Closes #[issue_number]
```

## 🚢 Deployment & Production

### Cloud Infrastructure (Render.com)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Render.com                               │
│                                                                  │
│  ┌────────────────┐    ┌──────────────────┐    ┌─────────────┐ │
│  │   PostgreSQL   │←───│  Backend Service │←───│  Static Site│ │
│  │   Database     │    │   (Web Service)  │    │  (Frontend) │ │
│  │                │    │                  │    │             │ │
│  │  Port: 5432    │    │  Port: 8080      │    │  Port: 443  │ │
│  │  DATABASE_URL  │    │  Auto-deploy     │    │  CDN Cache  │ │
│  └────────────────┘    └──────────────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Production URLs

| Service         | URL                                                                                                                    | Status     |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Frontend**    | [moodtracker-frontend-jbfn.onrender.com](https://moodtracker-frontend-jbfn.onrender.com)                               | 🟢 Live    |
| **Backend API** | [moodtracker-backend-2fk4.onrender.com/api/MoodEntries](https://moodtracker-backend-2fk4.onrender.com/api/MoodEntries) | 🟢 Live    |
| **Database**    | Internal PostgreSQL 16                                                                                                 | 🟢 Running |

### Deployment Process

**Automatic (CD Pipeline):**

1. Developer merge PR to `main`
2. GitHub Actions `cd.yml` workflow triggered
3. Docker images built and pushed to GitHub Container Registry
4. Render webhooks trigger redeployment
5. Database migrations run automatically on backend startup
6. Health checks verify services are responding

**Manual (Render Dashboard):**

```bash
# Trigger deploy: Settings → Deploy → "Deploy latest commit"
# View logs:     Logs → Select Service → Real-time output
# Env vars:      Environment → Add/Edit Variables
```

### Performance Metrics

| Metric               | Current (Free Tier) | Target (Paid) |
| -------------------- | ------------------- | ------------- |
| Cold Start           | ~30s                | <5s           |
| Response Time (P95)  | <500ms              | <200ms        |
| Uptime               | 99.5%               | 99.9%         |
| Database Connections | Max 20              | Pooled        |

## 📚 Documentație Adițională

### README-uri Specializate

- 📘 [Backend README](backend/MoodTrackerAPI/README.md) - Arhitectură API, teste unitare, setup backend
- 📘 [Frontend README](frontend/README.md) - Physics engine, Spatial UI, component architecture
- 📘 [CI/CD Documentation](.github/CICD.md) - Pipeline configuration, workflows, best practices
- 📘 [Render Deployment Guide](.github/RENDER_DEPLOYMENT_GUIDE.md) - Step-by-step cloud deployment

### API Documentation

- 🔧 **Swagger UI:** [http://localhost:5162/swagger](http://localhost:5162/swagger) (când backend rulează local)
- 🔧 **Production API:** [https://moodtracker-backend-2fk4.onrender.com/api/MoodEntries](https://moodtracker-backend-2fk4.onrender.com/api/MoodEntries)

### Resources & Links

- 🎯 **GitHub Repository:** [nastase1/mpi-project](https://github.com/nastase1/mpi-project)
- 🚀 **Live Demo:** [moodtracker-frontend-jbfn.onrender.com](https://moodtracker-frontend-jbfn.onrender.com)
- 📊 **GitHub Projects Board:** [Project Management](https://github.com/nastase1/mpi-project/projects)

---

## 🎓 Proiect Academic

### Criterii Îndeplinite (MPI 2025-2026)

#### ✅ Nota de Echipă (4p) - Management & Proces

| Criteriu                                      | Status      | Punctaj |
| --------------------------------------------- | ----------- | ------- |
| **1. Managementul Cerințelor**                | ✅ Complete | 1.5p    |
| - Backlog cu 10+ User Stories                 | ✅          |         |
| - Format "As a user..." + Acceptance Criteria | ✅          |         |
| - Labels, Milestones, Estimates               | ✅          |         |
| **2. Git Flow & Code Review**                 | ✅ Complete | 1.0p    |
| - Main branch protejat                        | ✅          |         |
| - Lucru pe branch-uri (feat/, fix/)           | ✅          |         |
| - Pull Requests legate de Issues              | ✅          |         |
| - Code Review între colegi                    | ✅          |         |
| **3. CI/CD & Infrastructure**                 | ✅ Complete | 1.0p    |
| - docker-compose.yml funcțional               | ✅          |         |
| - GitHub Actions (teste + linting + deploy)   | ✅          |         |
| - Deploy automat în Render.com                | ✅          |         |
| **4. Documentație**                           | ✅ Complete | 0.5p    |
| - README complet (Setup, Arhitectură, Echipă) | ✅          |         |

#### ✅ Nota Individuală (1p) - Contribuție Tehnică

| Rol                    | Membru         | Livrabile                                          | Status |
| ---------------------- | -------------- | -------------------------------------------------- | ------ |
| **Backend Developer**  | Petcu Gabriela | API structure, Database design, Unit tests (5+)    | ✅     |
| **Frontend Developer** | Negoiță Andrei | UI implementation, API integration, Docker config  | ✅     |
| **QA Engineer**        | Milica Andreea | Test scenarios, E2E/Integration tests, Bug reports | ✅     |
| **DevOps Engineer**    | Năstase Teodor | CI/CD pipeline, Cloud setup, Monitoring & Logging  | ✅     |

### Tehnologii Folosite (conform cerințelor)

- ✅ **Arhitectură:** Client-Server (REST API)
- ✅ **Stack:** ASP.NET Core + React + TypeScript
- ✅ **Persistență:** PostgreSQL (relational)
- ✅ **Dockerized:** `docker compose up` pornește tot stack-ul
- ✅ **GitHub:** Code, Issues, PRs, Actions
- ✅ **Cloud Deploy:** Render.com (auto-deploy)

---

## 📄 Licență

Acest proiect este dezvoltat în scop educațional pentru cursul **Managementul Proiectelor Informatice (MPI)** - Semestrul II, Anul Universitar 2025-2026, Facultatea de Matematică și Informatică, Universitatea Transilvania Brașov.

**Coordonator:** Asist. Mrd. Cezar Constăndoiu

---

<div align="center">

**Developed with ❤️ by Team GAAT**

_Gabriela • Andrei • Andreea • Teodor_

[![GitHub](https://img.shields.io/badge/GitHub-nastase1%2Fmpi--project-181717?logo=github)](https://github.com/nastase1/mpi-project)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render)](https://moodtracker-frontend-jbfn.onrender.com)

</div>
