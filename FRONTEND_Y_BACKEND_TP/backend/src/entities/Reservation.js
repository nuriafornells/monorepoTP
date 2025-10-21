const { EntitySchema } = require('@mikro-orm/core');

module.exports = new EntitySchema({
  name: 'Reservation',
  tableName: 'Reservations',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    date: { type: 'date' },
    status: { type: 'string', default: 'pending' },
    user: {
  kind: 'm:1',
  entity: () => require('./User'),
  inversedBy: 'reservations',
},
paquete: {
  kind: 'm:1',
  entity: () => require('./Paquete'),
  inversedBy: 'reservations',
},

     createdAt: { type: 'date', fieldName: 'createdAt', nullable: true },
     updatedAt: { type: 'date', fieldName: 'updatedAt', nullable: true },
  },
});
