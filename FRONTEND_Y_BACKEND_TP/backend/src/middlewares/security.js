// src/middlewares/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite default
    'http://localhost:3000', // Create React App default
    'http://localhost:4173', // Vite preview
    process.env.FRONTEND_ORIGIN
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // Disable CSP for local development
  crossOriginResourcePolicy: false, // Disable CORP for local development
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta más tarde' },
});

// Allow disabling the login limiter for local debugging/tests by setting
// DISABLE_LOGIN_LIMITER=true in the environment. Never enable this in production.
let loginLimiter;
if (process.env.DISABLE_LOGIN_LIMITER === 'true') {
  // no-op middleware
  loginLimiter = (req, res, next) => next();
} else {
  loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // límite por IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos de login, intenta más tarde' },
  });
}

module.exports = {
  corsOptions,
  helmetMiddleware,
  apiLimiter,
  loginLimiter,
};