const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// GET /api/images → lista todas las imágenes disponibles
router.get('/', (req, res) => {
  const imagesDir = path.join(__dirname, '../../public');
  fs.readdir(imagesDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer la carpeta de imágenes' });
    // Filtrar solo imágenes válidas
    const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    res.json({ images });
  });
});

module.exports = router;
