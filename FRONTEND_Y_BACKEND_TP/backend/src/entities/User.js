const { EntitySchema } = require('@mikro-orm/core');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'Users',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    name: { type: 'string', nullable: true, length: 255 },
    email: { type: 'string', unique: true, length: 255 },
    password: { type: 'string' },
    role: { type: 'string', default: 'user' },
    reservations: { reference: '1:m', entity: 'Reservation', mappedBy: 'user' },
    createdAt: { type: 'date', nullable: false },
    updatedAt: { type: 'date', nullable: false },
  },
});
