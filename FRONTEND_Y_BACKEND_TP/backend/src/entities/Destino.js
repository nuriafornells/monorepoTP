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
      mappedBy: 'destino', // relacion bidireccional, destino tiene muchos hoteles
    },
  },
});
//entitySchema define la estructura de la entidad Destino en la base de datos, incluyendo sus propiedades y relaciones con otras entidades.