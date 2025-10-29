const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/login", login);
router.post("/register", register);

// Nuevo endpoint para validar sesión
router.get("/me", verifyToken, (req, res) => {
  if (!req.userEntity) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }
  res.json({
    user: {
      id: req.userEntity.id,
      email: req.userEntity.email,
      role: req.userEntity.role,
    },
  });
});

module.exports = router;