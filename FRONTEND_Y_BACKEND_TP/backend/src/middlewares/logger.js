// src/middlewares/logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

function requestLogger(req, res, next) {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
}

module.exports = { logger, requestLogger };