# 🎭 Daily Mood Tracker

Aplicație web full-stack pentru urmărirea dispoziției zilnice, dezvoltată ca proiect pentru cursul de Managementul Proiectelor Informatice.

## 📋 Descriere

Daily Mood Tracker permite utilizatorilor să-și înregistreze starea emoțională zilnică, să adauge notițe personale și să vizualizeze istoricul într-un format interactiv și atractiv vizual.

## 👥 Echipa

| Rol | Nume | Responsabilități |
|-----|------|------------------|
| **Backend Developer** | [Nume] | API REST, Baza de date, Logica de business |
| **Frontend Developer** | [Nume] | Interfața utilizator, Integrare API |
| **QA Engineer** | [Nume] | Teste automate, Validare calitate |
| **DevOps Engineer** | [Nume] | Docker, CI/CD, Cloud Deployment |

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/MoodEntries` | Returnează toate înregistrările |
| GET | `/api/MoodEntries/{id}` | Returnează o înregistrare specifică |
| POST | `/api/MoodEntries` | Creează o înregistrare nouă |
| DELETE | `/api/MoodEntries/{id}` | Șterge o înregistrare |

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

## 🔧 Configurare Environment Variables

### Backend (.env)

```env
ConnectionStrings__DefaultConnection=Server=localhost;Database=MoodTrackerDb;Trusted_Connection=True;
ASPNETCORE_ENVIRONMENT=Development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5162/api/MoodEntries
```

**⚠️ Important:** Nu commitați fișierele `.env` în Git! Folosiți `.env.example` ca template.

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

## 🐛 Troubleshooting

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
