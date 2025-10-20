const { MikroORM } = require('@mikro-orm/core');
const config = require('../../mikro-orm.config');

let ormInstance = null;

async function initORM() {
  if (!ormInstance) {
    ormInstance = await MikroORM.init(config);
  }
  return ormInstance;
}

module.exports = { initORM };
