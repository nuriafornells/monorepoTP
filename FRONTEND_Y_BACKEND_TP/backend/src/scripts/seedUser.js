// backend/src/scripts/seedUser.js
const bcrypt = require('bcrypt');
const { MikroORM } = require('@mikro-orm/core');
const User = require('../entities/User');

(async () => {
  try {
    const orm = await MikroORM.init();
    const em = orm.em.fork();

    const now = new Date();

    // ADMIN
    const adminEmail = 'admin@admin.com';
    const adminExists = await em.findOne(User, { email: adminEmail });

    if (!adminExists) {
      const admin = em.create(User, {
        name: 'Administrador',
        email: adminEmail,
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        createdAt: now,
        updatedAt: now,
      });
      await em.persistAndFlush(admin);
      console.log('✅ Admin creado:', adminEmail);
    } else {
      console.log('⚠️ Admin ya existe:', adminEmail);
    }

    // CLIENTE
    const clientEmail = 'user@user.com';
    const clientExists = await em.findOne(User, { email: clientEmail });

    if (!clientExists) {
      const client = em.create(User, {
        name: 'Cliente Ejemplo',
        email: clientEmail,
        password: await bcrypt.hash('user123', 10),
        role: 'user',
        createdAt: now,
        updatedAt: now,
      });
      await em.persistAndFlush(client);
      console.log('✅ Cliente creado:', clientEmail);
    } else {
      console.log('⚠️ Cliente ya existe:', clientEmail);
    }

    await orm.close();
  } catch (err) {
    console.error('❌ Error creando usuarios:', err);
    process.exit(1);
  }
})();
// Script para crear usuarios admin y cliente si no existen en la base de datos