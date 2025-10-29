const express = require("express");
const router = express.Router();
const {
  createReservation,
  getReservations,
  updateReservationStatus,
  getReservationsByUser, // ✅ importar el nuevo controlador
} = require("../controllers/reservationController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/", verifyToken, createReservation); // crear reserva
router.get("/", verifyToken, getReservations);    // listar todas (admin)
router.get("/user/:id", verifyToken, getReservationsByUser); // ✅ NUEVA RUTA
router.patch("/:id/status", verifyToken, updateReservationStatus);

module.exports = router;