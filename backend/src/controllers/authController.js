console.log('authController cargado');

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// LOGIN
const login = async (req, res, next) => {
   console.log('📥 Body recibido en login:', req.body);
  const { email, password } = req.body;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está definido en el .env");
    }

    const user = await User.findOne({ where: { email } });

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

    const { id, role } = user; // ✅ acceso directo sin .get()
    console.log('🧠 Rol del usuario:', role);

    const token = jwt.sign(
      { id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role });
  } catch (err) {
    console.error("❌ Error interno en login:", err);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

// REGISTER
const register = async (req, res, next) => {
  console.log('📥 Body recibido en register:', req.body);

  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const err = new Error('El usuario ya existe');
      err.statusCode = 400;
      return next(err);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    res.status(201).json({
      message: 'Usuario creado',
      user: {
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('❌ Error en register:', err);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

module.exports = {
  login,
  register,
};