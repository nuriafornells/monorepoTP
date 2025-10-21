require('dotenv').config();
require('reflect-metadata');

const { initORM } = require('../config/orm');

(async () => {
  try {
    const orm = await initORM();
    const em = orm.em.fork();

    const repo = em.getRepository('Paquete');

    const paquetes = [
      {
        nombre: 'Bariloche Aventura',
        destino: 'Bariloche',
        duracion: 5,
        precio: 45000,
        publicado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Mendoza Gourmet',
        destino: 'Mendoza',
        duracion: 3,
        precio: 38000,
        publicado: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'Iguazú Naturaleza',
        destino: 'Misiones',
        duracion: 4,
        precio: 42000,
        publicado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const data of paquetes) {
      const nuevo = repo.create(data);
      await em.persistAndFlush(nuevo);
    }

    console.log('Paquetes insertados correctamente');
    process.exit();
  } catch (error) {
    console.error('Error al insertar paquetes:', error);
    process.exit(1);
  }
})();