module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Reservation.associate = (models) => {
    Reservation.belongsTo(models.User, { foreignKey: 'userId' });
    Reservation.belongsTo(models.Paquete, { foreignKey: 'packageId' });
  };

  return Reservation;
};