const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  console.log('Body recibido en login:', req.body);
  const { email, password } = req.body;
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está definido en el .env');
    }

    const em = req.em;
    if (!em) throw new Error('EntityManager no inicializado en la request');

    const userRepo = em.getRepository('User');
    const user = await userRepo.findOne({ email });
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.statusCode = 404;
      return next(err);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const err = new Error('Contraseña incorrecta');
      err.statusCode = 401;
      return next(err);
    }

    const { id, role } = user;
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token, role, id });
  } catch (err) {
    console.error('Error interno en login:', err);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const register = async (req, res, next) => {
  console.log('Body recibido en register:', req.body);
  const { email, password, role } = req.body;
  try {
    const em = req.em;
    if (!em) throw new Error('EntityManager no inicializado en la request');

    const userRepo = em.getRepository('User');
    const existingUser = await userRepo.findOne({ email });
    if (existingUser) {
      const err = new Error('El usuario ya existe');
      err.statusCode = 400;
      return next(err);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    const user = userRepo.create({
      email,
      password: hashedPassword,
      role: role || 'user',
      createdAt: now,
      updatedAt: now,
    });
    await em.persistAndFlush(user);

    return res.status(201).json({ message: 'Usuario creado', user: { email: user.email, role: user.role, id: user.id } });
  } catch (err) {
    console.error('Error en register:', err);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

module.exports = { login, register };