// src/routes/destinos.routes.js
const express = require('express');
const { body, param } = require('express-validator');
const {
  getAllDestinos,
  getDestinoById,
  createDestino,
  updateDestino,
  deleteDestino
} = require('../controllers/destinos.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');
const validate = require('../middlewares/validate');

const router = express.Router();

// PÚBLICO: Listar destinos
router.get('/', getAllDestinos);

// PÚBLICO: Detalle de destino
router.get(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('id debe ser número>0'),
    validate
  ],
  getDestinoById
);

// PROTEGIDAS (solo admin)
router.use(verifyToken, verifyAdmin);

// Crear destino
router.post(
  '/',
  [
    body('nombre').isString().notEmpty().withMessage('nombre es obligatorio'),
    body('pais').isString().notEmpty().withMessage('pais es obligatorio'),
    body('descripcion').optional().isString(),
    body('imagenUrl').optional().isURL().withMessage('imagenUrl inválida'),
    validate
  ],
  createDestino
);

// Actualizar destino
router.put(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('id debe ser número>0'),
    body('nombre').optional().isString().withMessage('nombre inválido'),
    body('pais').optional().isString().withMessage('pais inválido'),
    body('pais')
       .optional()
       .isString().withMessage('pais debe ser texto')
       .notEmpty().withMessage('pais no puede estar vacío'),
    body('descripcion').optional().isString(),
    body('imagenUrl').optional().isURL().withMessage('imagenUrl inválida'),
    validate
  ],
  updateDestino
);

// Eliminar destino
router.delete(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('id debe ser número>0'),
    validate
  ],
  deleteDestino
);

module.exports = router;
