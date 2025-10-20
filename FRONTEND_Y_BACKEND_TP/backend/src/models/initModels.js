// src/models/initModels.js
const fs = require('fs');
const path = require('path');

module.exports = (sequelize) => {
  const models = {};

  const files = fs
    .readdirSync(__dirname)
    .filter(
      (file) =>
        file !== 'initModels.js' &&
        file !== 'index.js' &&
        file.endsWith('.js')
    );

  for (const file of files) {
    console.log('🧩 Cargando modelo:', file);
    const modelDefiner = require(path.join(__dirname, file));
    const model = modelDefiner(sequelize, sequelize.Sequelize.DataTypes);
    models[model.name] = model;
  }

  // ⚙️ Ejecutar asociaciones si existen
  Object.keys(models).forEach((modelName) => {
    if (typeof models[modelName].associate === 'function') {
      models[modelName].associate(models);
    }
  });

  return models;
};
