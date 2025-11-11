// backend/src/routes/PaquetesRoutes.js
const express = require('express');
const paquetesCtrl = require('../controllers/paquetes.controller');
const { verifyToken, verifyAdmin, optionalAuth } = require('../middlewares/auth');
const { packageCreateRules, handleValidation } = require('../middlewares/validators');

const router = express.Router();

// Público: si hay token lo usa, si no muestra solo publicados
router.get('/', optionalAuth, paquetesCtrl.getAllPackages);

// Público: solo publicados, sin token
router.get('/published', paquetesCtrl.getPublishedPackages);

// Detalle de un paquete: opcional auth (admin ve todos, user solo publicados)
router.get('/:id', optionalAuth, paquetesCtrl.getPackageById);

// Crear paquete: solo admin
router.post('/', verifyToken, verifyAdmin, packageCreateRules, handleValidation, paquetesCtrl.createPackage);

// Actualizar paquete: solo admin
router.put('/:id', verifyToken, verifyAdmin, packageCreateRules, handleValidation, paquetesCtrl.updatePackage);

// Toggle publicar/despublicar: solo admin
router.patch('/:id/publish', verifyToken, verifyAdmin, paquetesCtrl.togglePublish);

// Eliminar paquete: solo admin
router.delete('/:id', verifyToken, verifyAdmin, paquetesCtrl.deletePackage);

module.exports = router;