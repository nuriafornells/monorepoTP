const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('🚫 No se proporcionó el token');
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // Espera formato "Bearer token"
  console.log('🔐 Token recibido:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guarda el usuario en la request
    console.log('✅ Token verificado, usuario:', decoded);
    next();
  } catch (err) {
    console.log('❌ Error al verificar token:', err.message);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;