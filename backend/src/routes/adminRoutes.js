const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.get('/admin', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo admins' });
  }

  res.json({ message: 'Bienvenida al panel admin, Nuri 😎' });
});

module.exports = router;