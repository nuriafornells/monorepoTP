const express = require('express');
const verifyToken = require('../middlewares/verifyToken');

const {
  getAllPackages,
  getPublishedPackages,
  getPackageById,
  createPackage,
  updatePackage,
  togglePublish,
  deletePackage,
} = require('../controllers/paquetes.controller');

const router = express.Router();

// endpoint público para clientes
router.get('/publicos', getPublishedPackages);

// protegemos las rutas siguientes
router.use(verifyToken);

router.post('/', createPackage);
router.get('/', getAllPackages);
router.get('/:id', getPackageById);
router.put('/:id', updatePackage);
router.patch('/:id/publicar', togglePublish);
router.delete('/:id', deletePackage);

module.exports = router;