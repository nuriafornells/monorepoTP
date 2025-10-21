require('dotenv').config();
const { MikroORM } = require('@mikro-orm/mysql');
const Hotel = require('../entities/Hotel');
const Destino = require('../entities/Destino');

(async () => {
  const orm = await MikroORM.init();
  const em = orm.em.fork();

  try {
    const argentina = await em.findOne(Destino, { nombre: 'Argentina' });
    const brasil = await em.findOne(Destino, { nombre: 'Brasil' });

    if (!argentina || !brasil) throw new Error('❌ Destinos no encontrados');

    const hoteles = [
      em.create(Hotel, {
        nombre: 'Hotel Meliá',
        ubicacion: 'Buenos Aires',
        categoria: '5 estrellas',
        destino: argentina,
      }),
      em.create(Hotel, {
        nombre: 'Hotel Iguazú',
        ubicacion: 'Misiones',
        categoria: '4 estrellas',
        destino: argentina,
      }),
      em.create(Hotel, {
        nombre: 'Hotel Copacabana',
        ubicacion: 'Río de Janeiro',
        categoria: '4 estrellas',
        destino: brasil,
      }),
    ];

    hoteles.forEach(h => em.persist(h));
    await em.flush();
    console.log('✅ Hoteles insertados correctamente');
  } catch (error) {
    console.error('❌ Error al insertar hoteles:', error);
  } finally {
    await orm.close();
  }
})();