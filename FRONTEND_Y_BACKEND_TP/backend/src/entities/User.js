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
    reservations: {
  kind: '1:m',
  entity: () => require('./Reservation'),
  mappedBy: 'user',
},
    createdAt: { type: 'date', fieldName: 'createdAt', nullable: true },
    updatedAt: { type: 'date', fieldName: 'updatedAt', nullable: true },
  },
});
