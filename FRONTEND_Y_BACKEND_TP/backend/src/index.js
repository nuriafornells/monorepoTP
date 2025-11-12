// src/index.js
require('dotenv').config();
require('reflect-metadata');

const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const paquetesRoutes = require('./routes/PaquetesRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const destinosRoutes = require('./routes/destinos.routes');
const hotelsRoutes = require('./routes/hotels.routes');
const usersRoutes = require('./routes/users.routes');
const imagesRoutes = require('./routes/imagesRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // <-- aseguramos que esté montado
const { initORM } = require('./config/orm');

const { helmetMiddleware, corsOptions, apiLimiter, loginLimiter } = require('./middlewares/security');
const { requestLogger } = require('./middlewares/logger');

const app = express();

// Si estás detrás de un proxy (Heroku, nginx) habilitar trust proxy
app.set('trust proxy', 1);

// Seguridad básica
app.use(helmetMiddleware);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json());

// Logger de requests
app.use(requestLogger);

// Limiter global para evitar abuso
app.use(apiLimiter);

// Static files (imágenes)
app.use('/images', express.static(path.join(__dirname, '..', 'public')));

// Mount upload route so frontend can POST to http://localhost:3001/upload
app.use('/upload', uploadRoutes);

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

    // Aplicar limiter específico para login (se ejecuta antes de authRoutes)
    // authRoutes probablemente define POST /login, por eso montamos el limiter en la ruta completa
    app.use('/api/auth/login', loginLimiter);

    // rutas montadas bajo /api
    app.use('/api/auth', authRoutes);
    app.use('/api/paquetes', paquetesRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/reservations', reservationRoutes);
    app.use('/api/destinos', destinosRoutes);
    app.use('/api/hoteles', hotelsRoutes);
    app.use('/api/users', usersRoutes);
    app.use('/api/images', imagesRoutes); // listado de imágenes

    // handler de errores después de montar rutas
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor: ', error);
    if (error && error.stack) console.error(error.stack);
    process.exit(1);
  }
})();