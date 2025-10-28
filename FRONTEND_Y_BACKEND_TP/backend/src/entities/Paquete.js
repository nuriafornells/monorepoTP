const { EntitySchema } = require('@mikro-orm/core');

module.exports = new EntitySchema({
  name: 'Paquete',
  tableName: 'paquetes',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    nombre: { type: 'string', length: 255 },
    descripcion: { type: 'string', nullable: true },
    duracion: { type: 'number' },
    precio: { type: 'number' },
    fechaInicio: { type: 'date', nullable: true, fieldName: 'fechaInicio' },
    fechaFin: { type: 'date', nullable: true, fieldName: 'fechaFin' },
    publicado: { type: 'boolean', default: false },
    fotoURL: { type: 'string', length: 500, nullable: true, fieldName: 'fotoURL' },

  

    hotel: {
      kind: 'm:1',
      entity: () => require('./Hotel'),
      inversedBy: 'paquetes',
    },

    reservations: {
      kind: '1:m',
      entity: () => require('./Reservation'),
      mappedBy: 'paquete',
    },

    createdAt: { type: 'date', fieldName: 'createdAt', nullable: true },
    updatedAt: { type: 'date', fieldName: 'updatedAt', nullable: true },
  },
});