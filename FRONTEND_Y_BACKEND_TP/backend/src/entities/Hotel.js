const { EntitySchema } = require('@mikro-orm/core');

module.exports = new EntitySchema({
  name: 'Hotel',
  tableName: 'Hotels',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    nombre: { type: 'string', length: 255 },
    ubicacion: { type: 'string', length: 255 },
    categoria: { type: 'string', nullable: true },

    destino: {
      kind: 'm:1',
      entity: () => require('./Destino'),
      inversedBy: 'hoteles',
    },

    paquetes: {
      kind: '1:m',
      entity: () => require('./Paquete'),
      mappedBy: 'hotel',
    },

    createdAt: { type: 'date', fieldName: 'createdAt', nullable: true },
    updatedAt: { type: 'date', fieldName: 'updatedAt', nullable: true },
  },
});