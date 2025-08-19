const fs = require('fs');
const path = require('path');

module.exports = (sequelize) => {
  const models = {};

  const files = fs
    .readdirSync(__dirname)
    .filter(
      (file) =>
        file !== 'initModels.js' &&
        file !== 'index.js' && // 👈 excluye el archivo que rompe
        file.endsWith('.js')
    );

  for (const file of files) {
    console.log('🧩 Cargando modelo:', file);
    const modelDefiner = require(path.join(__dirname, file));
    const model = modelDefiner(sequelize, sequelize.Sequelize.DataTypes);
    models[model.name] = model;
  }

  return models;
};