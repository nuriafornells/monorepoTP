// src/routes/PaquetesRoutes.js
const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  getAllPackages,
  getPublishedPackages,
  getPackageById,
  createPackage,
  updatePackage,
  togglePublish,
  deletePackage
} = require('../controllers/paquetes.controller');
const verifyToken = require('../middlewares/verifyToken');
const validate = require('../middlewares/validate');

const router = express.Router();

// Listar públicos con filtros opcionales
router.get(
  '/publicos',
  [
    query('destinoId').optional().isInt().withMessage('destinoId debe ser número'),
    query('precioMin').optional().isFloat({ min: 0 }).withMessage('precioMin inválido'),
    query('precioMax').optional().isFloat({ min: 0 }).withMessage('precioMax inválido'),
    query('duracionMin').optional().isInt({ min: 0 }).withMessage('duracionMin inválida'),
    query('duracionMax').optional().isInt({ min: 0 }).withMessage('duracionMax inválida'),
    validate
  ],
  getPublishedPackages
);

// Protegidas con token
router.use(verifyToken);

// Crear paquete
router.post(
  '/',
  [
    body('nombre').isString().notEmpty().withMessage('nombre es obligatorio'),
    body('precio').isFloat({ gt: 0 }).withMessage('precio debe ser mayor a 0'),
    body('duracion').isInt({ gt: 0 }).withMessage('duracion debe ser entero>0'),
    body().custom(body => {
      if (!body.destinoId && !body.destino) {
        throw new Error('destinoId o destino es obligatorio');
      }
      return true;
    }),
    body('cupo').optional().isInt({ min: 0 }).withMessage('cupo inválido'),
    validate
  ],
  createPackage
);

// Obtener paquete por ID
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('id debe ser número'),
    validate
  ],
  getPackageById
);

// Actualizar paquete
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('id debe ser número'),
    body('nombre').optional().isString().withMessage('nombre inválido'),
    body('precio').optional().isFloat({ gt: 0 }).withMessage('precio inválido'),
    body('duracion').optional().isInt({ gt: 0 }).withMessage('duracion inválida'),
    body('cupo').optional().isInt({ min: 0 }).withMessage('cupo inválido'),
    validate
  ],
  updatePackage
);

// Publicar/despublicar
router.patch(
  '/:id/publicar',
  [
    param('id').isInt().withMessage('id debe ser número'),
    validate
  ],
  togglePublish
);

// Eliminar paquete
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('id debe ser número'),
    validate
  ],
  deletePackage
);

module.exports = router;
