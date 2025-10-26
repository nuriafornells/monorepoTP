// src/entities/Reservation.js
const { EntitySchema } = require('@mikro-orm/core');

module.exports = new EntitySchema({
  name: 'Reservation',
  tableName: 'reservations',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    fechaReserva: { type: 'date', nullable: true, fieldName: 'fechaReserva' },
    fechaInicio: { type: 'date', nullable: true, fieldName: 'fecha_inicio' },
    fechaFin: { type: 'date', nullable: true, fieldName: 'fecha_fin' },
    cantidadPersonas: { type: 'number', fieldName: 'cantidadPersonas' },
    status: { type: 'string', default: 'pendiente', fieldName: 'estado' },

    user: {
      kind: 'm:1',
      entity: () => require('./User'),
      inversedBy: 'reservations',
      reference: true,
    },
    paquete: {
      kind: 'm:1',
      entity: () => require('./Paquete'),
      inversedBy: 'reservations',
      reference: true,
    },
    createdAt: { type: 'date', fieldName: 'createdAt', nullable: true },
    updatedAt: { type: 'date', fieldName: 'updatedAt', nullable: true },
  },
});