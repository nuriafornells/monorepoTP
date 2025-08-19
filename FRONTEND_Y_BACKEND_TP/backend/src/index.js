const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const db = require('./config/db');
const initModels = require('./models/initModels'); // ✅ carga modular

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

// ✅ Rutas únicas y bien definidas
app.use('/api/auth', authRoutes);
app.use('/api/paquetes', paquetesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationRoutes); // 🆕 ruta activa

// 🧯 Middleware global de errores
app.use(errorHandler);

// 🌍 Ruta base
app.get('/', (req, res) => {
  res.send('🌍 Backend funcionando');
});

// 🚀 Inicio del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    await db.authenticate();
    console.log('✅ Conectado a MySQL');

    const models = initModels(db); // 🧬 carga todos los modelos
    await db.sync({ alter: true }); // o force: true si querés resetear

    console.log('📦 Modelos sincronizados');
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
  }

  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});