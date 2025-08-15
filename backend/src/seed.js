const bcrypt = require('bcrypt');
const User = require('./models/User');
const db = require('./config/db');

const seed = async () => {
  await db.sync({ force: true });

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await User.create({
    email: 'admin@admin.com',
    password: hashedPassword,
    role: 'admin',
  });

  await User.create({
    email: 'user@user.com',
    password: await bcrypt.hash('user123', 10),
    role: 'user',
  });

  console.log('🌱 Usuarios creados');
  process.exit();
};

seed();