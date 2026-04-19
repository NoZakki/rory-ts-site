/**
 * Express Application Setup
 * Main application file with middleware configuration
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Middleware imports
const {
  helmetMiddleware,
  apiLimiter,
  csrfTokenMiddleware,
  sanitizeHeaders,
} = require('./middleware/security');
const {
  errorHandler,
  notFoundHandler,
} = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const adminRoutes = require('./routes/admin');
const supportRoutes = require('./routes/support');
const shareRoutes = require('./routes/share');

const app = express();

// ==================== SECURITY MIDDLEWARE ====================

// SECURITY: Helmet - Set security headers
app.use(helmetMiddleware);

// SECURITY: CORS configuration
// Supporta più origini (sviluppo + produzione)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Permetti richieste senza origin (es. curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  maxAge: 86400, // Preflight cache for 24 hours
};
app.use(cors(corsOptions));

// SECURITY: Sanitize headers
app.use(sanitizeHeaders);

// SECURITY: Body parsers with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// SECURITY: Cookie parser for HttpOnly cookies
app.use(cookieParser(process.env.SESSION_SECRET));

// SECURITY: Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// SECURITY: General API rate limiter
app.use('/api/', apiLimiter);

// SECURITY: CSRF token middleware
app.use(csrfTokenMiddleware);

// ==================== HEALTH CHECK ====================

/**
 * GET /health
 * Simple health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ==================== API ROUTES ====================

/**
 * Mount authentication routes
 * Endpoints: /api/auth/*
 */
app.use('/api/auth', authRoutes);

/**
 * Mount file routes
 * Endpoints: /api/files/*
 */
app.use('/api/files', fileRoutes);

/**
 * Mount admin routes
 * Endpoints: /api/admin/*
 */
app.use('/api/admin', adminRoutes);

/**
 * Mount support routes
 * Endpoints: /api/support/*
 */
app.use('/api/support', supportRoutes);

/**
 * Mount file share routes
 * Endpoints: /api/share/*
 */
app.use('/api/share', shareRoutes);

// ==================== ERROR HANDLING ====================

/**
 * 404 Not Found handler
 * Must be after all routes
 */
app.use(notFoundHandler);

/**
 * Global error handler
 * Must be after all other middleware and routes
 */
app.use(errorHandler);

module.exports = app;
