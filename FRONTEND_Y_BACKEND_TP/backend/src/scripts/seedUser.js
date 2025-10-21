require('dotenv').config();
require('reflect-metadata');
const bcrypt = require('bcrypt');
const { initORM } = require('../config/orm');

(async () => {
  try {
    const orm = await initORM();
    const em = orm.em.fork();

    const userRepo = em.getRepository('User');
    const now = new Date();

    const admin = userRepo.create({
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      createdAt: now,   // 👈 camelCase
      updatedAt: now,   // 👈 camelCase
    });

    const user = userRepo.create({
      email: 'user@user.com',
      password: await bcrypt.hash('user123', 10),
      role: 'user',
      createdAt: now,   // 👈 camelCase
      updatedAt: now,   // 👈 camelCase
    });

    await em.persistAndFlush([admin, user]);

    console.log('✅ Usuarios creados correctamente');
    process.exit();
  } catch (err) {
    console.error('❌ Error al crear usuarios:', err);
    process.exit(1);
  }
})();