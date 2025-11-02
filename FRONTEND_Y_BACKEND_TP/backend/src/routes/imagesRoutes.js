// src/routes/imagesRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Desde src/routes, subimos dos niveles: ../.. -> backend/
// carpeta public está en la raíz del backend
const imagesDir = path.join(__dirname, '..', '..', 'public');

router.get('/', (req, res) => {
  console.log('Images list request - reading dir:', imagesDir);
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading images dir:', err);
      return res.status(500).json({ error: 'No se pudo leer la carpeta de imágenes' });
    }
    const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    console.log('Found images:', images);
    res.json({ images });
  });
});

module.exports = router;