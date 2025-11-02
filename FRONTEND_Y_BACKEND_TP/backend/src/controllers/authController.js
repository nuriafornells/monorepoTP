// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUserEntity } = require('../services/user.service');

const login = async (req, res, next) => {
  console.log('Body recibido en login: ', req.body);
  const { email, password } = req.body;
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT SECRET no está definido en el .env');
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
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({ token, role, id });
  } catch (err) {
    console.error('Error interno en login: ', err);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const register = async (req, res, next) => {
  console.log('Body recibido en register: ', req.body);
  try {
    const { name, email, password } = req.body;
    // delegamos validaciones y persistencia al servicio
    const created = await createUserEntity({ name, email, password, role: 'user' }, req.em);
    return res.status(201).json({ message: 'Usuario creado', user: created });
  } catch (err) {
    console.error('Error en register: ', err);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

module.exports = { login, register };