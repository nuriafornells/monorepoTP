require('dotenv').config();
const { MikroORM } = require('@mikro-orm/mysql');
const Destino = require('../entities/Destino');

(async () => {
  const orm = await MikroORM.init();
  const em = orm.em.fork();

  try {
    const destinos = [
      em.create(Destino, { nombre: 'Argentina' }),
      em.create(Destino, { nombre: 'Brasil' }),
      em.create(Destino, { nombre: 'Chile' }),
    ];

    destinos.forEach(d => em.persist(d));
    await em.flush();
    console.log('✅ Destinos insertados correctamente');
  } catch (error) {
    console.error('❌ Error al insertar destinos:', error);
  } finally {
    await orm.close();
  }
})();