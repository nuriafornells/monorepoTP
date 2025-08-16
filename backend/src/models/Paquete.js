module.exports = (sequelize, DataTypes) => {
  const Paquete = sequelize.define('Paquete', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destino: {
      type: DataTypes.STRING,
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
  });

  return Paquete;
};