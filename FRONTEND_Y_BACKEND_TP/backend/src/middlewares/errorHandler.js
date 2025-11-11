// src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  const status = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message =
    (err && err.message) || 'Error inesperado en el servidor';
  if (process.env.NODE_ENV !== 'production') {
    console.error('[errorHandler]', { status, message, stack: err?.stack });
  }
  res.status(status).json({ error: message });
};