const { EntitySchema } = require('@mikro-orm/core');

module.exports = new EntitySchema({
  name: 'Destino',
  tableName: 'destinos',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    nombre: { type: 'string', length: 255 },
    hoteles: {
      kind: '1:m',
      entity: () => require('./Hotel'),
      mappedBy: 'destino',
    },
  },
});