require('dotenv').config();
require('reflect-metadata');

const { initORM } = require('../config/orm');
const Hotel = require('../entities/Hotel');
const Paquete = require('../entities/Paquete');

(async () => {
  try {
    const orm = await initORM();
    const em = orm.em.fork();

    const repo = em.getRepository(Paquete);

    const melia = await em.findOne(Hotel, { nombre: 'Hotel Meliá' });
    const iguazu = await em.findOne(Hotel, { nombre: 'Hotel Iguazú' });
    const copa = await em.findOne(Hotel, { nombre: 'Hotel Copacabana' });

    if (!melia || !iguazu || !copa) throw new Error('❌ Hoteles no encontrados');

    const paquetes = [
      {
        nombre: 'Bariloche Aventura',
        descripcion: 'Exploración en la Patagonia con actividades al aire libre.',
        duracion: 5,
        precio: 45000,
        fechaInicio: new Date('2025-12-10'),
        fechaFin: new Date('2025-12-15'),
        publicado: true,
        hotel: melia,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Iguazú Naturaleza',
        descripcion: 'Recorrido por la selva misionera y las cataratas.',
        duracion: 4,
        precio: 42000,
        fechaInicio: new Date('2025-11-05'),
        fechaFin: new Date('2025-11-09'),
        publicado: true,
        hotel: iguazu,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Río de Janeiro Relax',
        descripcion: 'Playas, samba y descanso en Copacabana.',
        duracion: 3,
        precio: 38000,
        fechaInicio: new Date('2025-10-20'),
        fechaFin: new Date('2025-10-23'),
        publicado: false,
        hotel: copa,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const data of paquetes) {
      const nuevo = repo.create(data);
      await em.persistAndFlush(nuevo);
    }

    console.log('✅ Paquetes insertados correctamente');
    process.exit();
  } catch (error) {
    console.error('❌ Error al insertar paquetes:', error);
    process.exit(1);
  }
})();