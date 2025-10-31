const jwt = require('jsonwebtoken');

const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ mensaje: 'Token no proporcionado' });
  if (!authHeader.startsWith('Bearer ')) return res.status(400).json({ mensaje: 'Formato de token inválido' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const role = req.userEntity?.role ?? decoded.role;
    if (role !== 'admin') return res.status(403).json({ mensaje: 'Acceso denegado: solo admins' });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};

module.exports = verifyAdmin;
// Middleware para verificar que el usuario autenticado tiene rol de admin antes de permitir acceso a rutas protegidas.