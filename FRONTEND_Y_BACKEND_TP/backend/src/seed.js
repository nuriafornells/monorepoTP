// src/seed.js
const bcrypt = require('bcrypt');
const db = require('./config/db');
const initModels = require('./models/initModels');

(async () => {
  try {
    // 1) Inicializa los modelos y recrea todas las tablas
    const models = initModels(db);
    await db.sync({ force: true });

    const { User, Destino, Paquete } = models;

    // 2) Crear usuarios
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedUser  = await bcrypt.hash('user123', 10);

    await User.create({
      email: 'admin@admin.com',
      password: hashedAdmin,
      role: 'admin'
    });

    await User.create({
      email: 'user@user.com',
      password: hashedUser,
      role: 'user'
    });

    console.log('✅ Usuarios creados');

    // 3) Crear destinos
    const destinosData = [
      { nombre: 'Bariloche', pais: 'Argentina', descripcion: 'Montañas y lagos', imagenUrl: '', publicado: true },
      { nombre: 'Mendoza',   pais: 'Argentina', descripcion: 'Vinos y bodegas', imagenUrl: '', publicado: true },
      { nombre: 'Iguazú',    pais: 'Argentina', descripcion: 'Cataratas impresionantes', imagenUrl: '', publicado: true }
    ];

    for (const d of destinosData) {
      await Destino.findOrCreate({
        where: { nombre: d.nombre },
        defaults: d
      });
    }

    console.log('✅ Destinos creados');

    // 4) Mapear nombre → id de destino
    const allDestinos = await Destino.findAll();
    const mapNombreId = {};
    allDestinos.forEach(d => {
      mapNombreId[d.nombre] = d.id;
    });

    // 5) Crear paquetes
    const paquetesData = [
      { nombre: 'Bariloche Aventura', destino: 'Bariloche', duracion: 5, precio: 45000, publicado: true, cupo: 15 },
      { nombre: 'Mendoza Gourmet',    destino: 'Mendoza',   duracion: 3, precio: 38000, publicado: true, cupo: 12 },
      { nombre: 'Iguazú Naturaleza',   destino: 'Iguazú',    duracion: 4, precio: 42000, publicado: true, cupo: 10 }
    ];

    for (const p of paquetesData) {
      const destinoId = mapNombreId[p.destino];
      await Paquete.findOrCreate({
        where: { nombre: p.nombre },
        defaults: {
          nombre: p.nombre,
          destinoId,
          duracion: p.duracion,
          precio: p.precio,
          publicado: p.publicado,
          cupo: p.cupo
        }
      });
    }

    console.log('✅ Paquetes creados');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  }
})();
