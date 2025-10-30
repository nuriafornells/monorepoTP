const { EntitySchema } = require('@mikro-orm/core');

module.exports = new EntitySchema({
  name: 'Hotel',
  tableName: 'hotels',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    nombre: { type: 'string', length: 255 },
    ubicacion: { type: 'string', length: 255 },
    destino: {
      kind: 'm:1',
      entity: () => require('./Destino'),
      inversedBy: 'hoteles',
      nullable: true,
    },
    paquetes: {
      kind: '1:m',
      entity: () => require('./Paquete'),
      mappedBy: 'hotel',
    },
  },
});