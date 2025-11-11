// src/routes/users.routes.js
const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const usersCtrl = require('../controllers/users.controller');

const router = express.Router();

// GET /api/users -> admin only
router.get('/', verifyToken, verifyAdmin, usersCtrl.getUsers);

// GET /api/users/:id -> admin or same user
router.get('/:id', verifyToken, usersCtrl.getUserById);

// POST /api/users -> create user (registro) - público
router.post('/', usersCtrl.createUser);

// PUT /api/users/:id -> admin or same user
router.put('/:id', verifyToken, usersCtrl.updateUser);

// DELETE /api/users/:id -> admin only
router.delete('/:id', verifyToken, verifyAdmin, usersCtrl.deleteUser);

module.exports = router;