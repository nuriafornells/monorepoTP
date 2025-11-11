// src/routes/paquetes.routes.js
const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const { packageCreateRules, handleValidation } = require('../middlewares/validators');
const paquetesCtrl = require('../controllers/paquetes.controller');

const router = express.Router();

// GET /api/paquetes  -> si querés público, podés quitar verifyToken; aquí lo dejamos protegido y el controller filtra según rol
router.get('/', verifyToken, paquetesCtrl.getAllPackages);

// GET /api/paquetes/published  -> público
router.get('/published', paquetesCtrl.getPublishedPackages);

// GET /api/paquetes/:id
router.get('/:id', verifyToken, paquetesCtrl.getPackageById);

// POST /api/paquetes  -> solo admin
router.post('/', verifyToken, verifyAdmin, packageCreateRules, handleValidation, paquetesCtrl.createPackage);

// PUT /api/paquetes/:id -> solo admin
router.put('/:id', verifyToken, verifyAdmin, packageCreateRules, handleValidation, paquetesCtrl.updatePackage);

// PATCH publish toggle -> admin
router.patch('/:id/publish', verifyToken, verifyAdmin, paquetesCtrl.togglePublish);

// DELETE -> admin
router.delete('/:id', verifyToken, verifyAdmin, paquetesCtrl.deletePackage);

module.exports = router;