// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function verifyAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Autenticación requerida' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
  next();
}

module.exports = { verifyToken, verifyAdmin };