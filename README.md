# 🔐 Secure Cloud Storage

A full-stack web application for secure, encrypted file storage with a focus on privacy and best security practices.

**Demo video walkthrough**: [Coming soon]

## 🎯 Project Overview

Secure Cloud Storage is a production-ready demonstration of security best practices applied to a real-world application. It provides:

- ✅ Secure user authentication with JWT
- ✅ File encryption at rest (AES-256)
- ✅ Password hashing with bcrypt
- ✅ Protection against common web attacks (XSS, CSRF, SQL Injection)
- ✅ Rate limiting and input validation
- ✅ Activity logging and audit trails
- ✅ Modern React UI
- ✅ RESTful API
- ✅ PostgreSQL database

## 📋 Quick Start

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Setup

#### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Generate encryption key and setup
node scripts/setup.js

# Update .env with generated keys
# Edit .env and fill in:
# - Database credentials
# - JWT secrets
# - Encryption key

# Create PostgreSQL database
createdb cloud_storage_db

# Start backend server (development)
npm run dev
```

Backend will be running on `http://localhost:5000`

#### 2. Frontend Setup

```bash
# In another terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Frontend will be running on `http://localhost:3000`

#### 3. Test the Application

1. Go to `http://localhost:3000`
2. Click "Register here" and create an account
3. Upload a file (drag and drop or click to browse)
4. Add notes to your file
5. Download or delete files as needed

**Demo Credentials** (if seed data is added):

```
Email: demo@example.com
Password: DemoPass123!
```

## 🏗️ Architecture

### Folder Structure

```
RORY_TS_SITE/
├── backend/
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth, security, error handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utilities (encryption, validation, logging)
│   │   ├── app.js         # Express app
│   │   └── server.js      # Server entry point
│   ├── uploads/           # Encrypted file storage
│   ├── scripts/           # Setup scripts
│   ├── package.json
│   ├── .env               # Environment variables
│   └── README.md          # Backend documentation
│
├── frontend/
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── context/       # React Context
│   │   ├── styles/        # Stylesheets
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .env               # Environment variables
│   └── README.md          # Frontend documentation
│
└── README.md              # This file
```

## 🔐 Security Architecture

### Authentication Flow

```
User Input → Validation → bcrypt Hash → JWT Token → HttpOnly Cookie → Protected Routes
```

### File Encryption Flow

```
File Upload → Validation → AES-256 Encrypt → Random Filename → Secure Storage
                                                   ↓
Download Request → Verify Ownership → Decrypt → Send to User
```

### Security Layers

| Layer | Implementation |
|-------|-----------------|
| Transport | HTTPS assumptions, Secure cookies |
| Authentication | JWT tokens in HttpOnly cookies |
| Password Security | bcrypt with 10 salt rounds |
| File Encryption | AES-256-CBC with random IV |
| Input Validation | Server-side sanitization |
| Rate Limiting | Login: 5 attempts/15 min |
| CSRF Protection | SameSite cookies, CSRF tokens |
| SQL Injection | Parameterized queries |
| XSS Protection | Input sanitization |
| Security Headers | Helmet.js middleware |

## 📚 API Documentation

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Logout
```bash
POST /api/auth/logout
Authorization: Bearer {token}
```

### Files

#### Upload File
```bash
POST /api/files/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

[Form: file (multipart)]
```

#### List Files
```bash
GET /api/files
Authorization: Bearer {token}
```

#### Download File
```bash
GET /api/files/{fileId}/download
Authorization: Bearer {token}
```

#### Delete File
```bash
DELETE /api/files/{fileId}
Authorization: Bearer {token}
```

#### Update File Note
```bash
POST /api/files/{fileId}/notes
Content-Type: application/json
Authorization: Bearer {token}

{
  "noteContent": "Your file note here..."
}
```

## 🔑 Environment Variables

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cloud_storage_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Server
NODE_ENV=development
PORT=5000

# Authentication
JWT_SECRET=your_generated_secret_key
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_secret

# Encryption
ENCRYPTION_KEY=64_character_hex_string

# Security
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=52428800

# Logging
LOG_LEVEL=info
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Unit Tests (Backend)

```bash
cd backend
npm test
```

### Integration Tests

```bash
# Test full flow with curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Upload file (drag & drop)
- [ ] Download file
- [ ] Add note to file
- [ ] Delete file
- [ ] Logout
- [ ] Test with invalid password (rate limiting)
- [ ] Test file size limit
- [ ] Test file type validation

## 📊 Database Schema

### users

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | User ID |
| email | VARCHAR(255) UNIQUE | User email |
| password_hash | VARCHAR(255) | bcrypt hashed password |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

### files

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | File ID |
| user_id | INTEGER FK | Owner user ID |
| filename | VARCHAR(255) | Encrypted storage name |
| original_name | VARCHAR(255) | Original filename |
| size | BIGINT | File size in bytes |
| mime_type | VARCHAR(100) | MIME type |
| created_at | TIMESTAMP | Upload time |
| updated_at | TIMESTAMP | Last update |

### file_notes

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Note ID |
| file_id | INTEGER FK | Associated file |
| note_content | TEXT | Annotation text |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

### activity_logs

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Log ID |
| user_id | INTEGER FK | User performing action |
| action | VARCHAR(100) | Action type |
| details | TEXT | Additional info |
| ip_address | VARCHAR(45) | Request IP |
| created_at | TIMESTAMP | Log time |

## 🚀 Deployment

### Docker Deployment

```bash
# Backend
docker build -t cloud-storage-backend ./backend
docker run -p 5000:5000 -e DB_HOST=db cloud-storage-backend

# Frontend
docker build -t cloud-storage-frontend ./frontend
docker run -p 3000:3000 cloud-storage-frontend
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong JWT secrets (32+ characters)
- [ ] Generate encryption key with `node scripts/setup.js`
- [ ] Configure HTTPS/SSL certificates
- [ ] Set secure database password
- [ ] Configure proper CORS_ORIGIN
- [ ] Enable database backups
- [ ] Set up monitoring and alerting
- [ ] Enable audit logging
- [ ] Configure WAF (Web Application Firewall)
- [ ] Implement rate limiting at reverse proxy level
- [ ] Set up log rotation and retention

## 🔍 Security Best Practices Demonstrated

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Strong password requirements
   - Never store plain text passwords

2. **Authentication**
   - JWT tokens with expiration
   - HttpOnly secure cookies
   - Refresh token rotation
   - Session invalidation on logout

3. **File Security**
   - AES-256 encryption at rest
   - Random filenames (no path traversal)
   - File type validation
   - Size limits
   - Ownership verification

4. **Input Security**
   - Server-side validation
   - Input sanitization (XSS prevention)
   - Parameterized SQL queries (SQL injection prevention)
   - CSRF token verification

5. **Network Security**
   - HTTPS enforcement assumptions
   - CORS configuration
   - Security headers (Helmet)
   - Rate limiting

6. **Audit & Monitoring**
   - Activity logging
   - Failed login tracking
   - File operation logging
   - Audit trail

## 📖 Learning Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## ⚠️ Disclaimer

This project is for educational purposes. While it implements many security best practices, it should NOT be used in production without:

1. **Professional Security Audit** - Have security experts review the code
2. **Compliance Review** - Ensure compliance with regulations (GDPR, HIPAA, etc.)
3. **Threat Modeling** - Assess specific threats to your use case
4. **Penetration Testing** - Test against real-world attack vectors
5. **Security Training** - Team training on secure operations

## 📞 Support & Issues

For issues, questions, or contributions:

1. Check existing documentation
2. Review security logs for error details
3. Check backend and frontend README files
4. Submit issues with detailed information

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built as a demonstration of security best practices for:
- Secure password handling
- File encryption
- JWT authentication
- Input validation
- Access control

---

**Last Updated**: April 2026
**Version**: 1.0.0
