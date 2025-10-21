const { EntitySchema } = require('@mikro-orm/core');

module.exports = new EntitySchema({
  name: 'Paquete',
  tableName: 'Paquetes',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    nombre: { type: 'string', length: 255 },
    destino: { type: 'string', length: 255 },
    duracion: { type: 'number' },
    precio: { type: 'number' },
    publicado: { type: 'boolean', default: false },
    reservations: {
  kind: '1:m',                        
  entity: () => require('./Reservation'), 
  mappedBy: 'paquete',
},
    createdAt: { type: 'date', fieldName: 'createdAt', nullable: true },
    updatedAt: { type: 'date', fieldName: 'updatedAt', nullable: true },
  },
});