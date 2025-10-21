const jwt = require('jsonwebtoken');

const publicRoutes = ['/api/auth/login', '/api/auth/register'];

const verifyToken = async (req, res, next) => {
  if (publicRoutes.includes(req.originalUrl)) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado' });
  if (!authHeader.startsWith('Bearer ')) return res.status(400).json({ error: 'Formato de token inválido' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.em) {
      try {
        const userEntity = await req.em.findOne('User', decoded.id);
        if (userEntity) req.userEntity = userEntity;
      } catch (e) {
        console.warn('No se pudo cargar entidad User:', e.message || e);
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('Token verificado, usuario:', decoded);
    }

    next();
  } catch (err) {
    console.log('Error al verificar token:', err.message);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;