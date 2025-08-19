const express = require("express");
const verifyToken = require("../middlewares/verifyToken");

const {
  getAllPackages,
  getPublishedPackages, // 🆕 nuevo endpoint
  getPackageById,
  createPackage,
  updatePackage,
  togglePublish,
  deletePackage,
} = require("../controllers/paquetes.controller");

const router = express.Router();

// 🟢 Endpoint público para cliente (sin token)
router.get("/publicos", getPublishedPackages);

// 🔐 Protegemos todas las rutas siguientes
router.use(verifyToken);

// Crear nuevo paquete
router.post("/", createPackage);

// Obtener todos los paquetes (admin)
router.get("/", getAllPackages);

// Obtener un paquete por ID
router.get("/:id", getPackageById);

// Actualizar paquete por ID
router.put("/:id", updatePackage);

// Publicar/despublicar paquete
router.patch("/:id/publicar", togglePublish);

// Eliminar paquete
router.delete("/:id", deletePackage);

module.exports = router;