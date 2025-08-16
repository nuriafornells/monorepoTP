const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

// Ruta de bienvenida al panel admin
router.get('/', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo admins' });
  }

  res.json({ message: 'Bienvenida al panel admin' });
});

// Ruta protegida para ver paquetes VIP
router.get('/paquetes', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo admins' });
  }

  res.json({
    mensaje: '✅ Acceso solo para admins',
    paquetes: [
      { id: 101, nombre: 'Paquete VIP' },
      { id: 102, nombre: 'Paquete Elite' },
    ],
  });
});

module.exports = router;