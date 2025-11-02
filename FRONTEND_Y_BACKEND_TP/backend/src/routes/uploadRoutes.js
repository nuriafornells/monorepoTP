// src/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// publicDir apuntando a la carpeta public en la raíz del backend
const publicDir = path.join(__dirname, '..', '..', 'public');

// asegurarse que exista publicDir
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, publicDir);
  },
  filename: (req, file, cb) => {
    // Allow client to propose a desired name (without extension)
    const desired = (req.body && req.body.desiredName) ? String(req.body.desiredName).trim() : '';
    const ext = path.extname(file.originalname) || '';
    if (desired) {
      // sanitize desired name: remove unsafe chars and spaces
      const safe = desired.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
      let filename = safe + ext;
      // if a file with same name exists, append timestamp to avoid overwrite
      if (fs.existsSync(path.join(publicDir, filename))) {
        filename = `${safe}-${Date.now()}${ext}`;
      }
      cb(null, filename);
      return;
    }
    // fallback: keep unique suffix
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  },
});

// POST /upload
// Form fields:
// - image (file)
// - desiredName (optional, string, without extension)
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `http://localhost:3001/images/${req.file.filename}`;
    res.json({ message: 'File uploaded successfully', filename: req.file.filename, url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;