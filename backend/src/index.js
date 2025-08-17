const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const db = require('./config/db');

// 📦 Rutas
const authRoutes = require('./routes/authRoutes');
console.log('📦 authRoutes importado en index.js');
const paquetesRoutes = require('./routes/PaquetesRoutes'); // ✅ único import
const adminRoutes = require('./routes/adminRoutes'); // 🛂 nuevo import

const app = express(); // ✅ primero se declara

// 🛡️ CORS habilitado para el frontend
app.use(cors({
  origin: "http://localhost:5173", // adaptá si usás otro puerto en el front
  credentials: true
}));

// ✅ Respuesta explícita a preflight requests
app.options('*', cors());

app.use(express.json());

// ✅ Rutas únicas y bien definidas
app.use('/api/auth', authRoutes);
app.use('/api/paquetes', paquetesRoutes); // ✅ sin duplicaciones
app.use('/api/admin', adminRoutes); // 🛂 ruta protegida para admins

// 🧱 Modelos
const Paquete = require('./models/Paquete')(db, require('sequelize').DataTypes);

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
    const User = require('./models/User');
    await db.sync({ force: false });
    console.log('📦 Modelos sincronizados');
    console.log('✅ Conectado a MySQL');
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
  }
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});