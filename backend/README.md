# Secure Cloud Storage Backend

A secure, privacy-focused cloud storage API built with Node.js, Express, and PostgreSQL.

## 🔐 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **Encryption**: AES-256 file encryption at rest
- **Authentication**: JWT tokens with HttpOnly secure cookies
- **Rate Limiting**: Brute-force protection on login/registration
- **Input Validation**: Server-side validation and sanitization
- **CSRF Protection**: SameSite cookies + CSRF tokens
- **Security Headers**: Helmet.js for HTTP security headers
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization with xss library
- **Activity Logging**: Track user actions for audit trails

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and install dependencies**

```bash
cd backend
npm install
```

2. **Generate encryption key and secrets**

```bash
node scripts/setup.js
```

This will guide you through generating secure keys.

3. **Create `.env` file**

```bash
cp .env.example .env
```

Update with your values (the setup script will provide secure keys):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cloud_storage_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

NODE_ENV=development
PORT=5000

JWT_SECRET=your_generated_jwt_secret
REFRESH_TOKEN_SECRET=your_generated_refresh_secret

ENCRYPTION_KEY=your_generated_encryption_key_64_chars

CORS_ORIGIN=http://localhost:3000
```

4. **Create PostgreSQL database**

```bash
createdb cloud_storage_db
```

The application will auto-create tables on first run.

5. **Start development server**

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info

### Files

- `POST /api/files/upload` - Upload file
- `GET /api/files` - List all user files
- `GET /api/files/:fileId` - Get file metadata
- `GET /api/files/:fileId/download` - Download (decrypt) file
- `DELETE /api/files/:fileId` - Delete file
- `POST /api/files/:fileId/notes` - Add/update file note
- `GET /api/files/:fileId/notes` - Get file note

## 🏗️ Architecture

```
src/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Express middleware (auth, security, errors)
├── models/          # Database models
├── routes/          # API route definitions
├── services/        # Business logic
├── utils/           # Utilities (validation, encryption, logging)
├── app.js          # Express app setup
└── server.js       # Server startup
```

## 🔒 Security Best Practices

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### File Storage

- Files are stored with randomized names (not original names)
- Encrypted using AES-256-CBC
- IV (Initialization Vector) stored separately
- Type validation against whitelist
- Size limits (default 50MB)

### Authentication

- JWT tokens in HttpOnly cookies
- Secure flag set for HTTPS
- SameSite=Strict to prevent CSRF
- Rate limiting: 5 attempts per 15 minutes on login
- Rate limiting: 3 registrations per hour

### Logging

All security events are logged:
- User registration
- Login (success and failures)
- File uploads/downloads
- File deletions
- Note updates

## 🚨 Production Checklist

- [ ] Change all JWT secrets and encryption key
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL certificates
- [ ] Use strong PostgreSQL password
- [ ] Set `secure: true` in cookie options (already done when NODE_ENV=production)
- [ ] Configure proper CORS_ORIGIN
- [ ] Set up environment variables securely
- [ ] Enable database backups
- [ ] Monitor logs and error rates
- [ ] Implement audit logging
- [ ] Use WAF (Web Application Firewall)
- [ ] Rate limit file uploads
- [ ] Implement cleanup of old logs

## 📝 Example Usage

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'
```

### Upload File

```bash
curl -X POST http://localhost:5000/api/files/upload \
  -b cookies.txt \
  -F "file=@document.pdf"
```

### Download File

```bash
curl -X GET http://localhost:5000/api/files/1/download \
  -b cookies.txt \
  -o downloaded_file.pdf
```

## 🛠️ Development

### Run in development mode with hot reload

```bash
npm run dev
```

### Database Tables

The app auto-creates:

- `users` - User accounts with hashed passwords
- `files` - File metadata and ownership
- `file_notes` - Annotations for files
- `activity_logs` - Security audit trail

## ⚖️ License

MIT

## 🤝 Contributing

This is a demonstration project for security best practices.

## ⚠️ Disclaimer

This project is for educational purposes. For production use, consider:

- Professional security audit
- Third-party encryption verification
- Compliance with data protection laws (GDPR, HIPAA, etc.)
- Scalable storage solution (S3, Azure Blob)
- Advanced threat detection
- Insurance and liability coverage
