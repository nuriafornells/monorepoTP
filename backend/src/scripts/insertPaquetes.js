const sequelize = require('../config/db');
const { Paquete } = require('../models/initModels')(sequelize);

(async () => {
  try {
    await sequelize.sync({ alter: true });

    const paquetes = [
      {
        nombre: 'Bariloche Aventura',
        destino: 'Bariloche',
        duracion: 5,
        precio: 45000,
        publicado: true,
      },
      {
        nombre: 'Mendoza Gourmet',
        destino: 'Mendoza',
        duracion: 3,
        precio: 38000,
        publicado: false,
      },
      {
        nombre: 'Iguazú Naturaleza',
        destino: 'Misiones',
        duracion: 4,
        precio: 42000,
        publicado: true,
      },
    ];

    for (const data of paquetes) {
      await Paquete.create(data);
    }

    console.log('✅ Paquetes insertados correctamente');
    process.exit();
  } catch (error) {
    console.error('❌ Error al insertar paquetes:', error);
    process.exit(1);
  }
})();