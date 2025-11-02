// src/routes/users.routes.js
const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

const router = express.Router();

// Crear cliente/usuario (publico para registro desde admin?)
// Si querés que el registro público pase por /auth/register, podés eliminar este POST público.
// Aquí lo dejamos como admin-only create; si querés público, mover register a auth.
router.post('/', createUser);

// Protegemos las siguientes rutas: requiere token y admin
router.use(verifyToken);
router.use(verifyAdmin);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;