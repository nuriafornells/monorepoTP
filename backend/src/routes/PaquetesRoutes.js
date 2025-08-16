const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

const {
  getAllPackages,
  updatePackage,
  togglePublish,
  deletePackage,
} = require('../controllers/paquetes.controller');

// ✅ Obtener todos los paquetes (protegido)
router.get('/', verifyToken, getAllPackages);

// 🛠️ Actualizar paquete por ID (protegido)
router.put('/:id', verifyToken, updatePackage);

// 📢 Publicar/despublicar paquete (protegido)
router.patch('/:id/publicar', verifyToken, togglePublish);

// 🗑️ Eliminar paquete (protegido)
router.delete('/:id', verifyToken, deletePackage);

module.exports = router;