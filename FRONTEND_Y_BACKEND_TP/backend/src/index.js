// src/index.js
require('dotenv').config();
require('reflect-metadata');
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const paquetesRoutes = require('./routes/PaquetesRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const destinosRoutes = require('./routes/destinos.routes');
const hotelsRoutes = require('./routes/hotels.routes');
const { initORM } = require('./config/orm');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.options('*', cors());

app.use(express.json());

// Serve static files from public folder at /images
app.use('/images', express.static('public'));

// Health
app.get('/', (req, res) => res.send('Backend funcionando'));

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    const orm = await initORM();
    console.log('MikroORM inicializado');

    // attach request-scoped EM
    const ormMiddleware = require('./middlewares/ormMiddleware');
    app.use(ormMiddleware(orm));

    // rutas montadas bajo /api
    app.use('/api/auth', authRoutes);
    app.use('/api/paquetes', paquetesRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/reservations', reservationRoutes);
    app.use('/api/destinos', destinosRoutes);
    

    // handler de errores después de montar rutas
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    if (error && error.stack) console.error(error.stack);
    process.exit(1);
  }
})();