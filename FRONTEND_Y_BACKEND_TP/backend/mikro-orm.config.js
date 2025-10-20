const path = require('path');

module.exports = {
  // require entity schema files directly to avoid discovery issues in CJS
  entities: [
    require(path.resolve(__dirname, 'src', 'entities', 'Paquete.js')),
    require(path.resolve(__dirname, 'src', 'entities', 'User.js')),
    require(path.resolve(__dirname, 'src', 'entities', 'Reservation.js')),
  ],
  dbName: process.env.DB_NAME || 'DesinosDB',
  type: 'mysql',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: './migrations',
  },
};
