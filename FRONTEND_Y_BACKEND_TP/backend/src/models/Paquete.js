// src/models/Paquete.js
module.exports = (sequelize, DataTypes) => {
  const Paquete = sequelize.define('Paquete', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // ahora referenciamos a Destino por ID
    destinoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    publicado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    cupo: {               // opcional pero útil para reservas
      type: DataTypes.INTEGER,
      defaultValue: 10,
    }
  });

  Paquete.associate = (models) => {
    Paquete.hasMany(models.Reservation, { foreignKey: 'packageId' });
    Paquete.belongsTo(models.Destino, { foreignKey: 'destinoId', as: 'destino' });
  };

  return Paquete;
};
