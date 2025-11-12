// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUserEntity } = require('../services/user.service');

const login = async (req, res, next) => {
  console.log('Body recibido en login: ', req.body);
  const { email, password } = req.body;
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT SECRET no está definido en la .env');
    }

    const em = req.em;
    if (!em) return res.status(500).json({ error: 'ORM no inicializado en la request' });

    const userRepo = em.getRepository('User');
    const user = await userRepo.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const { id, role } = user;
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({ token, role, id });
  } catch (err) {
    console.error('Error interno en login: ', err);
    return next(err);
  }
};

const register = async (req, res, next) => {
  console.log('Body recibido en register: ', req.body);
  try {
    const { name, email, password } = req.body;
    // delegamos validaciones y persistencia al servicio
    const created = await createUserEntity({ name, email, password, role: 'user' }, req.em);

    const plain = created && created.toJSON ? created.toJSON() : { ...created };
    if (plain && plain.password) delete plain.password;

    return res.status(201).json({ message: 'Usuario creado', user: plain });
  } catch (err) {
    console.error('Error en register: ', err);
    return next(err);
  }
};

module.exports = { login, register };