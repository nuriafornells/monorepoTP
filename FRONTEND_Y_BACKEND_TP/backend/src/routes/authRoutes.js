console.log('authRoutes cargado');

const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken'); // 👈 Importás el middleware

// 🔐 Rutas públicas
router.post('/login', login);
router.post('/register', register);

// 🔒 Ruta protegida (requiere token)
router.get('/protegida', verifyToken, (req, res) => {
  res.json({
    message: '✅ Acceso autorizado',
    user: req.user, // Esto lo inyecta el middleware si el token es válido
  });
});

// ✅ Exportación al final
module.exports = router;