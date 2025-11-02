// src/services/user.service.js
const bcrypt = require('bcrypt');

async function createUserEntity({ name, email, password, role = 'user' }, em) {
  if (!em) throw new Error('EntityManager no inicializado');
  if (!name || !email || !password) {
    const err = new Error('name, email y password son requeridos');
    err.statusCode = 400;
    throw err;
  }
  const existing = await em.findOne('User', { email });
  if (existing) {
    const err = new Error('Ya existe un usuario con ese email');
    err.statusCode = 409;
    throw err;
  }
  const hashed = await bcrypt.hash(password, 10);
  const now = new Date();
  const user = em.create('User', {
    name,
    email,
    password: hashed,
    role,
    createdAt: now,
    updatedAt: now,
  });
  await em.persistAndFlush(user);
  const plain = user.toJSON ? user.toJSON() : { ...user };
  delete plain.password;
  return plain;
}

module.exports = { createUserEntity };