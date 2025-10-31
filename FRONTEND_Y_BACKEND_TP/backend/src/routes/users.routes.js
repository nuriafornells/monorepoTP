// src/routes/users.routes.js
const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// Crear cliente/usuario (público para registro)
router.post('/', createUser);

// Listado y operaciones protegidas (solo admin)
router.use(verifyToken);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
// Router para manejar rutas relacionadas con usuarios, incluyendo creación, obtención, actualización y eliminación, con protección de rutas mediante verifyToken