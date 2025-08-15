const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // 👈 NUEVO
const app = express();
const adminRoutes = require('./routes/adminRoutes');
app.use('/api', adminRoutes);

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes); // 👈 NUEVO: conecta las rutas de login

app.get('/', (req, res) => {
  res.send('🌍 Backend funcionando');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    await db.authenticate();
    const User = require('./models/User');
    await db.sync({ force: false }); // crea tabla si no existe
    console.log('📦 Modelos sincronizados');
    console.log('✅ Conectado a MySQL');
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
  }
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});