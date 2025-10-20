// scripts/insertPaquetes.js
const db = require('../src/config/db');
const initModels = require('../src/models/initModels');
const bcrypt = require('bcrypt');

(async () => {
  try {
    // sincronizar modelos
    const models = initModels(db);
    await db.sync({ alter: true });

    const { Destino, Paquete } = models;

    // Crear destinos (si no existen)
    const destinosData = [
      { nombre: 'Bariloche', pais: 'Argentina', descripcion: 'Montañas y lagos' },
      { nombre: 'Mendoza', pais: 'Argentina', descripcion: 'Vinos y bodegas' },
      { nombre: 'Iguazú', pais: 'Argentina', descripcion: 'Cataratas impresionantes' },
    ];

    const createdDestinos = [];
    for (const d of destinosData) {
      const [destino, created] = await Destino.findOrCreate({
        where: { nombre: d.nombre },
        defaults: d,
      });
      createdDestinos.push(destino);
    }

    // Map nombre -> id
    const mapNombreId = {};
    createdDestinos.forEach((d) => {
      mapNombreId[d.nombre] = d.id;
    });

    const paquetes = [
      {
        nombre: 'Bariloche Aventura',
        destinoId: mapNombreId['Bariloche'],
        duracion: 5,
        precio: 45000,
        publicado: true,
        cupo: 15,
      },
      {
        nombre: 'Mendoza Gourmet',
        destinoId: mapNombreId['Mendoza'],
        duracion: 3,
        precio: 38000,
        publicado: false,
        cupo: 12,
      },
      {
        nombre: 'Iguazú Naturaleza',
        destinoId: mapNombreId['Iguazú'],
        duracion: 4,
        precio: 42000,
        publicado: true,
        cupo: 10,
      },
    ];

    for (const p of paquetes) {
      await Paquete.findOrCreate({
        where: { nombre: p.nombre },
        defaults: p,
      });
    }

    console.log('✅ Destinos y paquetes insertados correctamente');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en insertPaquetes:', err);
    process.exit(1);
  }
})();
