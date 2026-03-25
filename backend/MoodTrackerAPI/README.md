# Daily Mood Tracker - Backend

## 📌 Descriere
Daily Mood Tracker este o aplicație care permite utilizatorilor să își noteze starea zilnică, să adauge o notiță și să vizualizeze istoricul.

Acest repository conține partea de **backend**, responsabilă pentru gestionarea datelor și expunerea unui API REST.

---

## 🧱 Arhitectură

Aplicația este construită pe arhitectură **Client-Server**:

- **Frontend:** (în dezvoltare / realizat de colegi)
- **Backend:** ASP.NET Core Web API
- **Database:** SQL Server (LocalDB)

Backend-ul este organizat folosind **Layered Architecture**:
- **Controllers** – expun endpointurile API
- **Services** – conțin logica de business
- **Models** – definesc structura datelor
- **Data** – configurarea bazei de date (DbContext)

---

## ⚙️ Tehnologii folosite

- C#
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- SQL Server (LocalDB)
- Swagger / OpenAPI
- xUnit (pentru teste)
- Git & GitHub
- Docker (în curs de integrare)

---

## 🗄️ Baza de date

- ORM folosit: **Entity Framework Core**
- Migrații utilizate pentru crearea tabelelor
- Tabel principal: `MoodEntries`

### Structura MoodEntry:
- `Id` (Guid)
- `Date` (DateTime)
- `Mood` (string)
- `Note` (string, opțional)

---

## 🔌 API Endpoints

### MoodEntries

- `GET /api/MoodEntries`  
  → returnează toate înregistrările

- `GET /api/MoodEntries/{id}`  
  → returnează o înregistrare după id

- `POST /api/MoodEntries`  
  → creează o înregistrare nouă

- `DELETE /api/MoodEntries/{id}`  
  → șterge o înregistrare

---

## ⚠️ Validări și erori

- Returnează **400 BadRequest** pentru date invalide:
  - mood gol
  - dată din viitor
- Returnează **404 NotFound** dacă resursa nu există
- Returnează **201 Created** la creare
- Returnează **204 NoContent** la ștergere

---

## 🧠 Logică implementată

- separare clară Controller → Service → Data
- folosirea Dependency Injection
- tratament corect al status codes
- validare input în controller

---

## 🧪 Teste

Au fost implementate **teste unitare** pentru `MoodEntryService` folosind:

- xUnit
- EF Core InMemory

Testele acoperă:
- creare MoodEntry
- returnare listă
- returnare după id
- ștergere
- cazuri negative (element inexistent)

---

## 🚀 Setup backend

1. Clonare repository:
```bash
git clone https://github.com/nastase1/mpi-project.git