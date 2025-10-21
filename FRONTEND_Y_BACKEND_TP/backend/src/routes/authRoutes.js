const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

// rutas públicas
router.post('/login', login);
router.post('/register', register);

// ejemplo de ruta protegida
router.get('/protegida', verifyToken, (req, res) => {
  res.json({
    message: 'Acceso autorizado',
    user: req.user,
  });
});

module.exports = router;