// src/middlewares/errorHandler.js
const { logger } = require('./logger');

function errorHandler(err, req, res, next) {
  const status = typeof err.statusCode === 'number' ? err.statusCode : err.status || 500;
  const message = (err && err.message) || 'Error inesperado en el servidor';

  // Log interno con stack
  if (logger && typeof logger.error === 'function') {
    logger.error(message, { stack: err?.stack, path: req.originalUrl, method: req.method });
  } else {
    console.error('[errorHandler]', { status, message, stack: err?.stack });
  }

  const payload = { error: message };
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err?.stack;
  }

  res.status(status).json(payload);
}

module.exports = errorHandler;