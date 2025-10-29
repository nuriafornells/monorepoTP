// src/controllers/users.controller.js
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
  try {
    const repo = req.em.getRepository('User');
    const users = await repo.findAll({ populate: ['reservations'] });
    // Por seguridad, no devolver password
    const safe = users.map(u => {
      const plain = u.toJSON ? u.toJSON() : { ...u };
      delete plain.password;
      return plain;
    });
    return res.status(200).json({ users: safe });
  } catch (error) {
    console.error('Error en getUsers:', error);
    return res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const getUserById = async (req, res) => {
  try {
    const repo = req.em.getRepository('User');
    const user = await repo.findOne(req.params.id, { populate: ['reservations'] });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const plain = user.toJSON ? user.toJSON() : { ...user };
    delete plain.password;
    return res.status(200).json({ user: plain });
  } catch (error) {
    console.error('Error en getUserById:', error);
    return res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email y password son requeridos' });

    const existing = await req.em.findOne('User', { email });
    if (existing) return res.status(409).json({ error: 'Ya existe un usuario con ese email' });

    const hashed = await bcrypt.hash(password, 10);
    const now = new Date();

    const user = req.em.create('User', {
      name: name ?? null,
      email,
      password: hashed,
      role, // 'user' por defecto; para clientes podemos usar 'user' o 'client' si querés distinguir
      createdAt: now,
      updatedAt: now,
    });

    await req.em.persistAndFlush(user);

    const plain = user.toJSON ? user.toJSON() : { ...user };
    delete plain.password;

    return res.status(201).json({ user: plain });
  } catch (error) {
    console.error('Error en createUser:', error);
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const repo = req.em.getRepository('User');
    const user = await repo.findOne(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (email && email !== user.email) {
      const exists = await req.em.findOne('User', { email });
      if (exists && exists.id !== user.id) {
        return res.status(409).json({ error: 'Email ya en uso por otro usuario' });
      }
      user.email = email;
    }

    user.name = name ?? user.name;
    if (typeof role === 'string') user.role = role;

    if (typeof password === 'string' && password.trim() !== '') {
      user.password = await bcrypt.hash(password, 10);
    }

    user.updatedAt = new Date();
    await req.em.persistAndFlush(user);

    const plain = user.toJSON ? user.toJSON() : { ...user };
    delete plain.password;

    return res.status(200).json({ user: plain });
  } catch (error) {
    console.error('Error en updateUser:', error);
    return res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const repo = req.em.getRepository('User');
    const user = await repo.findOne(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Si tiene reservas, podrías bloquear o manejar lógica (forzar con ?force=true)
    const reservas = await req.em.find('Reservation', { user: user.id }, { limit: 1 });
    const force = String(req.query.force || '').toLowerCase() === 'true';
    if (reservas.length > 0 && !force) {
      return res.status(409).json({
        error: 'No se puede eliminar el usuario porque tiene reservas asociadas. Usa ?force=true para forzar.',
      });
    }
    if (reservas.length > 0 && force) {
      await req.em.nativeDelete('Reservation', { user: user.id });
    }

    await req.em.removeAndFlush(user);
    return res.status(204).send();
  } catch (error) {
    console.error('Error en deleteUser:', error);
    return res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };