const express = require("express");
const router = express.Router();
const { createReservation } = require("../controllers/reservationController");
const verifyToken = require("../middlewares/verifyToken"); // si usás autenticación

router.post("/", verifyToken, createReservation); // protegida por token

module.exports = router;