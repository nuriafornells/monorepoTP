// src/middlewares/validate.js
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devuelvo array de errores con campo, mensaje y valor recibido
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;
