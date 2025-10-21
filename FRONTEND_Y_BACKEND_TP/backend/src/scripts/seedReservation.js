require('dotenv').config();
require('reflect-metadata');

const { initORM } = require('../config/orm');
const Reservation = require('../entities/Reservation');
const Paquete = require('../entities/Paquete');
const User = require('../entities/User');

(async () => {
  try {
    const orm = await initORM();
    const em = orm.em.fork();

    const paquete1 = await em.findOne(Paquete, { nombre: 'Bariloche Aventura' });
    const paquete2 = await em.findOne(Paquete, { nombre: 'Iguazú Naturaleza' });
    const user = await em.findOne(User, { id: 1 });

    if (!paquete1 || !paquete2 || !user) throw new Error('❌ Datos faltantes para reserva');

    const reservas = [
      em.create(Reservation, {
        fechaReserva: new Date('2025-10-25'),
        status: 'confirmada',
        cantidadPersonas: 2,
        paquete: paquete1,
        user,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      em.create(Reservation, {
        fechaReserva: new Date('2025-11-01'),
        status: 'pendiente',
        cantidadPersonas: 4,
        paquete: paquete2,
        user,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    reservas.forEach(r => em.persist(r));
    await em.flush();
    console.log('✅ Reservas insertadas correctamente');
  } catch (error) {
    console.error('❌ Error al insertar reservas:', error);
  } finally {
    process.exit();
  }
})();