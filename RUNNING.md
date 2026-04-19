# Installation & Running Guide

## 🚀 Quick Installation

### Automated Setup (Recommended)

```bash
# From root directory
node install-all.js
```

This will:
1. ✅ Generate encryption keys
2. ✅ Create `.env` files
3. ✅ Install backend dependencies
4. ✅ Install frontend dependencies

### Manual Setup

See [SETUP.md](./SETUP.md) for step-by-step instructions.

## ▶️ Running the Application

### Option 1: Simultaneous (All in one terminal)

```bash
npm start
```

This starts both backend and frontend concurrently.

### Option 2: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Option 3: Docker

```bash
# Start all services
docker-compose up

# In another terminal, stop all services
docker-compose down
```

## ✅ Verify Installation

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"ok",...}`

2. **Frontend Access**
   Open `http://localhost:3000` in browser

3. **Database Connection**
   ```bash
   psql -U postgres -d cloud_storage_db -c "SELECT * FROM users;"
   ```

## 🧪 Test the Application

1. Go to `http://localhost:3000`
2. Click "Register here"
3. Create account with strong password
4. Login
5. Upload a file (drag & drop)
6. Add notes to file
7. Download/delete file
8. Logout

## 📊 View Database

```bash
# Connect to PostgreSQL
psql -U postgres -d cloud_storage_db

# View tables
\dt

# View users
SELECT id, email, created_at FROM users;

# View files
SELECT id, user_id, original_name, size FROM files;

# View activity logs
SELECT user_id, action, created_at FROM activity_logs;

# Exit
\q
```

## 🔧 Common Issues

### Backend won't start

```bash
# Check if port 5000 is in use
# Windows: netstat -ano | findstr :5000
# macOS: lsof -i :5000

# Kill process or change PORT in .env
```

### Frontend won't start

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
cd frontend && npm install
npm start
```

### Database connection error

```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Create database if needed
createdb cloud_storage_db
```

### Encryption key error

```bash
# Regenerate in backend directory
cd backend
node scripts/setup.js
```

## 🛑 Stopping Services

### Single Terminal
```
Ctrl + C
```

### Separate Terminals
```
Ctrl + C in each terminal
```

### Docker
```bash
docker-compose down
```

## 📝 Logs

### Backend Logs
Check terminal where backend is running for:
- Connection logs
- Request logs
- Error messages
- File upload/download logs

### Frontend Logs
Check browser console (F12):
- API errors
- Network requests
- React warnings

### Docker Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 🔐 Security Notes

- **Development**: Using HTTP and localhost (OK)
- **Production**: Must use HTTPS, change all secrets
- **Database**: Dev password is `postgres_password`, change in production
- **Encryption**: Key generated - store securely
- **JWT Secret**: Generated - must keep secure

## 📚 Next Steps

- [ ] Explore the code
- [ ] Customize the UI
- [ ] Add new features
- [ ] Deploy to production (see README.md)
- [ ] Set up monitoring

## 📞 Support

1. Check `SETUP.md` for detailed setup
2. Check `backend/README.md` for API docs
3. Check `frontend/README.md` for UI details
4. Check terminal logs for errors

---

**Ready to go?** Run `npm start` or follow the manual setup in SETUP.md!
