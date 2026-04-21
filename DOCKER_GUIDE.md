# Docker Quick Start Guide

## 🎯 Ce face `docker compose up`?

Pornește automat:
1. **SQL Server database** (port 1433)
2. **Backend API** (port 5162)
3. **Frontend** (port 5173)

## 📝 Comenzi Utile

### Pornire

```bash
# Prima dată (build + start)
docker compose up --build

# Dacă imaginile sunt deja construite
docker compose up

# În background (detached mode)
docker compose up -d
```

### Oprire

```bash
# Stop containers (păstrează datele)
docker compose down

# Stop + șterge volume-uri (curăță tot)
docker compose down -v
```

### Debugging

```bash
# Vezi ce containere rulează
docker compose ps

# Vezi logs de la toate serviciile
docker compose logs

# Vezi logs de la un singur service
docker compose logs backend
docker compose logs frontend
docker compose logs db

# Follow logs în timp real
docker compose logs -f backend

# Intră în container pentru debugging
docker exec -it moodtracker-backend /bin/bash
docker exec -it moodtracker-frontend /bin/sh
```

### Rebuild

```bash
# Rebuild după modificări în cod
docker compose up --build

# Rebuild doar un service
docker compose build backend
docker compose up backend
```

### Cleanup

```bash
# Oprește tot și curăță
docker compose down -v

# Șterge imagini nefolosite
docker image prune

# Curățare completă Docker
docker system prune -a
```

## ⚠️ Probleme Comune

### 1. "Port already in use"

```bash
# Oprește procesele care folosesc porturile
# Windows: Task Manager → kill process on port 5162/5173
# Sau schimbă porturile în docker-compose.yml
```

### 2. "Database not ready"

```bash
# Backend așteaptă ca DB să fie healthy (30s max)
# Dacă tot dă eroare, restart:
docker compose restart backend
```

### 3. "Permission denied" pe Windows

```bash
# Rulează Docker Desktop ca Administrator
# Sau: Docker Desktop Settings → Resources → File Sharing
```

### 4. "No space left on device"

```bash
# Curăță Docker
docker system prune -a --volumes
```

## 🔄 Workflow Development

```bash
# 1. Pornește tot stack-ul
docker compose up -d

# 2. Vezi logs
docker compose logs -f

# 3. Faci modificări în cod...

# 4. Rebuild + restart
docker compose up --build

# 5. La final, oprește tot
docker compose down
```

## 🎓 Tips

- Folosește `docker compose up` (fără -d) prima dată ca să vezi logs
- `Ctrl+C` oprește container-ele dar nu le șterge
- Dacă vrei curățenie totală: `docker compose down -v`
- Logs sunt importante pentru debugging
- Dacă ceva nu merge, rebuild cu `--build`

## 📊 Verificare

După `docker compose up`, check:

✅ http://localhost:5173 - Frontend  
✅ http://localhost:5162/swagger - Backend API  
✅ SQL Server pe localhost:1433
