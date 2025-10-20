// src/models/Destino.js
module.exports = (sequelize, DataTypes) => {
  const Destino = sequelize.define('Destino', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagenUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    publicado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Destino.associate = (models) => {
    Destino.hasMany(models.Paquete, { foreignKey: 'destinoId' });
  };

  return Destino;
};
