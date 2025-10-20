const dotenv = require('dotenv');
dotenv.config();
// reflect-metadata is useful for some MikroORM metadata providers
require('reflect-metadata');

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
// Sequelize artifacts removed; we use MikroORM now

// 📦 Rutas
const authRoutes = require('./routes/authRoutes');
const paquetesRoutes = require('./routes/PaquetesRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reservationRoutes = require('./routes/reservationRoutes'); // 🆕 nueva ruta

const app = express();

// 🛡️ CORS habilitado para el frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.options('*', cors());
app.use(express.json());

// Routes will be mounted after initializing ORM so req.em exists in middlewares/controllers

// 🧯 Middleware global de errores
app.use(errorHandler);

// 🌍 Ruta base
app.get('/', (req, res) => {
  res.send('🌍 Backend funcionando');
});

// 🚀 Inicio del servidor
const PORT = process.env.PORT || 3001;
(async () => {
  try {
    // Init MikroORM (we migrated from Sequelize)
    const { initORM } = require('./config/orm');
    const orm = await initORM();
    console.log('✅ MikroORM inicializado');

  // Attach request-scoped EM
  const ormMiddleware = require('./middlewares/ormMiddleware');
  app.use(ormMiddleware(orm));

    // Mount routes that rely on req.em
    app.use('/api/auth', authRoutes);
    app.use('/api/paquetes', paquetesRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/reservations', reservationRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:');
    console.error(error);
    if (error && error.stack) console.error(error.stack);
    process.exit(1);
  }
})();