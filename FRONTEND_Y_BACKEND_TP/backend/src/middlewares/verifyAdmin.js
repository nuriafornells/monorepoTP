const jwt = require('jsonwebtoken');

const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // prefer user entity if attached by verifyToken
    const role = req.userEntity?.role ?? decoded.role;

    if (role !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado: solo admins' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};

module.exports = verifyAdmin;