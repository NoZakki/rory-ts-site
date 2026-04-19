# Quick Start Guide

Segui questi step per far partire l'applicazione in locale.

## 1️⃣ Prerequisiti

- **Node.js** 16+ ([https://nodejs.org](https://nodejs.org))
- **PostgreSQL** 12+ ([https://www.postgresql.org](https://www.postgresql.org))
- **Git** (opzionale)

## 2️⃣ Setup Database

### Windows (PostgreSQL)

1. Apri **psql** (PostgreSQL command line):
```bash
psql -U postgres
```

2. Crea il database:
```sql
CREATE DATABASE cloud_storage_db;
\q
```

### macOS (con Homebrew)

```bash
brew install postgresql
brew services start postgresql
createdb cloud_storage_db
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get install postgresql
sudo -u postgres createdb cloud_storage_db
```

## 3️⃣ Backend Setup

```bash
# Naviga nella cartella backend
cd backend

# Installa dipendenze
npm install

# Genera chiave di crittografia e configurazione
node scripts/setup.js

# Copia il file .env.example in .env (se non esiste)
copy .env.example .env   # Windows
# OR
cp .env.example .env      # macOS/Linux

# Modifica .env con i tuoi valori
# Importante: aggiorna Database credentials
# (Apri con un editor di testo)
```

### Configura .env

Apri `backend/.env` e aggiorna:

```env
# Database - MODIFICARE!
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cloud_storage_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Server
NODE_ENV=development
PORT=5000

# JWT - Generati da setup.js
JWT_SECRET=your_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here

# Encryption - Generato da setup.js
ENCRYPTION_KEY=your_encryption_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Avvia Backend

```bash
# Modalità development (con auto-reload)
npm run dev

# Oppure modalità produzione
npm start
```

✅ Backend sarà in esecuzione su `http://localhost:5000`

## 4️⃣ Frontend Setup

In un **nuovo terminale**:

```bash
# Naviga nella cartella frontend
cd frontend

# Installa dipendenze
npm install

# Avvia development server
npm start
```

✅ Frontend sarà in esecuzione su `http://localhost:3000`

## 5️⃣ Test Application

1. Apri browser: `http://localhost:3000`
2. Clicca su **"Register here"**
3. Crea account con:
   - Email: `test@example.com`
   - Password: `TestPass123!` (rispetta i requisiti)
4. Effettua login
5. Carica un file (drag & drop)
6. Aggiungi note al file
7. Scarica o cancella il file

## 🆘 Troubleshooting

### ❌ "Cannot connect to database"

**Soluzione:**
```bash
# Verifica che PostgreSQL è in esecuzione
psql -U postgres -c "SELECT version();"

# Se non è in esecuzione:
# Windows: Service -> PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo service postgresql start
```

### ❌ "Port 5000 already in use"

**Soluzione:**
```bash
# Cambia PORT in backend/.env
PORT=5001

# Oppure termina il processo su porta 5000:
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000 | kill -9 PID
```

### ❌ "npm install fails"

**Soluzione:**
```bash
# Pulisci npm cache
npm cache clean --force

# Reinstalla
npm install
```

### ❌ "ENCRYPTION_KEY invalid"

**Soluzione:**
```bash
# Rigenera da setup.js
cd backend
node scripts/setup.js

# Copia la chiave e aggiorna .env
```

### ❌ Frontend non comunica con Backend

**Verifica:**
- Backend è in esecuzione su `http://localhost:5000`
- Frontend ha `REACT_APP_API_URL=http://localhost:5000/api` in `.env`
- CORS è configurato correttamente: `CORS_ORIGIN=http://localhost:3000` in backend `.env`

## 📊 Test Database

Verifica che le tabelle siano create:

```bash
# Connetti al database
psql -U postgres -d cloud_storage_db

# Lista tabelle
\dt

# Esce
\q
```

Dovrai vedere:
- `users`
- `files`
- `file_notes`
- `activity_logs`

## 🔐 Credenziali Demo

Se crei un account di test, usa:
```
Email: demo@example.com
Password: DemoPass123!
```

Ricorda: La password deve rispettare tutti i requisiti di sicurezza!

## 📚 Documentazione

- **Backend Details**: `backend/README.md`
- **Frontend Details**: `frontend/README.md`
- **API Documentation**: `backend/README.md` (sezione API)

## 🛑 Fermare i server

**Backend:**
```
Ctrl + C nel terminale backend
```

**Frontend:**
```
Ctrl + C nel terminale frontend
```

## ✅ Prossimi Step

1. Esplora il codice per capire l'architettura di sicurezza
2. Modifica il design personalizzandolo
3. Aggiungi nuove features (quota spazio, condivisione, etc.)
4. Distribuisci in produzione (vedi deployment guide)

---

**Hai problemi?** Controlla i log del backend/frontend per dettagli degli errori.
