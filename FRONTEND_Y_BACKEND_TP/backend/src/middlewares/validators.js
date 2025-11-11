// src/middlewares/validators.js
const { check, validationResult } = require('express-validator');

const packageCreateRules = [
  check('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  check('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
  check('duracion').isInt({ gt: 0 }).withMessage('La duración debe ser un número entero mayor a 0'),
  check('hotelId').isInt({ gt: 0 }).withMessage('El hotelId debe ser válido'),
  check('fotoURL').optional().isString().trim(),
];

const reservationCreateRules = [
  check('packageId').isInt({ gt: 0 }).withMessage('packageId inválido'),
  check('userId').optional().isInt({ gt: 0 }).withMessage('userId inválido'),
  check('cantidadPersonas').isInt({ gt: 0 }).withMessage('cantidadPersonas debe ser mayor a 0'),
  check('fechaInicio').optional().isISO8601().withMessage('fechaInicio inválida'),
  check('fechaFin').optional().isISO8601().withMessage('fechaFin inválida'),
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
}

module.exports = {
  packageCreateRules,
  reservationCreateRules,
  handleValidation,
};