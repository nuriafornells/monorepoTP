const { EntitySchema } = require('@mikro-orm/core');

module.exports = new EntitySchema({
  name: 'Destino',
  tableName: 'Destinos',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    nombre: { type: 'string', length: 255 },

    hoteles: {
      kind: '1:m',
      entity: () => require('./Hotel'),
      mappedBy: 'destino',
    },

    createdAt: { type: 'date', fieldName: 'createdAt', nullable: true },
    updatedAt: { type: 'date', fieldName: 'updatedAt', nullable: true },
  },
});