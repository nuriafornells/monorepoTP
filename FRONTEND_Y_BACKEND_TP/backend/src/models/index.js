const sequelize = require('../config/db');
const initModels = require('./initModels');

const models = initModels(sequelize);

// Test de conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
})();

module.exports = {
  sequelize,
  ...models,
};