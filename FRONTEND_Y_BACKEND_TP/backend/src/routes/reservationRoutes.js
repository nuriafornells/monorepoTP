const express = require("express");
const router = express.Router();
const {
  createReservation,
  getReservations,
  updateReservationStatus,
} = require("../controllers/reservationController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/", verifyToken, createReservation); // crear reserva
router.get("/", verifyToken, getReservations);    // listar reservas
router.patch("/:id/status", verifyToken, updateReservationStatus);

module.exports = router;