const { EntitySchema } = require('@mikro-orm/core');

module.exports = new EntitySchema({
  name: 'Reservation',
  tableName: 'Reservations',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    date: { type: 'date' },
    status: { type: 'string', default: 'pending' },
    user: { reference: 'm:1', entity: 'User', inversedBy: 'reservations' },
    paquete: { reference: 'm:1', entity: 'Paquete', inversedBy: 'reservations' },
    createdAt: { type: 'date', nullable: true },
    updatedAt: { type: 'date', nullable: true },
  },
});
