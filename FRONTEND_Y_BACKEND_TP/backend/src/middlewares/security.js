// src/middlewares/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const helmetMiddleware = helmet();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta más tarde' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por 15 minutos
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de login, intenta más tarde' },
});

module.exports = {
  corsOptions,
  helmetMiddleware,
  apiLimiter,
  loginLimiter,
};