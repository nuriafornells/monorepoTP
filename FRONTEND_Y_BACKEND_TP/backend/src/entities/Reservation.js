const { EntitySchema } = require('@mikro-orm/core');

module.exports = new EntitySchema({
  name: 'Reservation',
  tableName: 'reservations',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    fechaInicio: { type: 'date', nullable: true, fieldName: 'fechaInicio' },
    fechaFin: { type: 'date', nullable: true, fieldName: 'fechaFin' },
    cantidadPersonas: { type: 'number', fieldName: 'cantidadPersonas' },
    status: { type: 'string', default: 'pendiente', fieldName: 'estado' },
    user: {
      kind: 'm:1',
      entity: () => require('./User'),
      inversedBy: 'reservations', // relacion bidireccional, user tiene muchas reservas
      reference: true,
    },
    paquete: {
      kind: 'm:1',
      entity: () => require('./Paquete'),
      inversedBy: 'reservations', // relacion bidireccional, paquete tiene muchas reservas
      reference: true,
    },
    createdAt: { type: 'date', fieldName: 'createdAt', nullable: true },
    updatedAt: { type: 'date', fieldName: 'updatedAt', nullable: true },
  },
});