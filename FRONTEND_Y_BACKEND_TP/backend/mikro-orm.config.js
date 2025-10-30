require('dotenv').config(); 

const path = require('path');
const { defineConfig } = require('@mikro-orm/mysql');

module.exports = defineConfig({
  entities: [
    require(path.resolve(__dirname, 'src/entities/User.js')),
    require(path.resolve(__dirname, 'src/entities/Paquete.js')),
    require(path.resolve(__dirname, 'src/entities/Reservation.js')),
    require(path.resolve(__dirname, 'src/entities/Hotel.js')),
    require(path.resolve(__dirname, 'src/entities/Destino.js')),
  ],
  dbName: process.env.DB_NAME || 'pruebo2dsw',
  driverOptions: {
    connection: { ssl: false },
  },
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: './migrations',
  },
});