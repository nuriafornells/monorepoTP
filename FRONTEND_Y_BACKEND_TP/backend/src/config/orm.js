// src/config/orm.js
const { MikroORM } = require('@mikro-orm/core');
const config = require('../../mikro-orm.config'); 

let ormInstance = null;

async function initORM() {
  if (!ormInstance) {
    ormInstance = await MikroORM.init(config); // inicializa MikroORM con la configuración proporcionada
  }
  return ormInstance;
}

module.exports = { initORM };

//mikroORM es un ORM para Node.js y TypeScript que facilita la interacción con bases de datos relacionales y NoSQL.