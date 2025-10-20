const express = require("express");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// ✅ Aplica verifyToken a todas las rutas de este router
router.use(verifyToken);

// Ruta de bienvenida al panel admin
router.get("/", (req, res) => {
  const role = req.userEntity?.role ?? req.user?.role;
  if (role !== "admin") {
    return res.status(403).json({ error: "Acceso denegado: solo admins" });
  }

  res.json({ message: "Bienvenida al panel admin" });
});

// Ruta protegida para ver paquetes VIP
router.get("/paquetes", (req, res) => {
  const role = req.userEntity?.role ?? req.user?.role;
  if (role !== "admin") {
    return res.status(403).json({ error: "Acceso denegado: solo admins" });
  }

  res.json({
    mensaje: "✅ Acceso solo para admins",
    paquetes: [
      { id: 101, nombre: "Paquete VIP" },
      { id: 102, nombre: "Paquete Elite" },
    ],
  });
});

module.exports = router;