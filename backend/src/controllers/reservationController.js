const { Reservation } = require("../models");

const createReservation = async (req, res) => {
  
  try {
    const { packageId, date, userId } = req.body;

    if (!packageId || !date || !userId) {
      return res.status(400).json({ message: "Faltan datos para la reserva" });
    }

    const nueva = await Reservation.create({
      packageId,
      date,
      userId,
      
    }
  );
  
    res.status(201).json(nueva);
  } catch (error) {
    console.error("❌ Error al crear reserva:", error);
    res.status(500).json({ message: "Hubo un problema al crear la reserva" });
  }
  console.log("📩 Reserva recibida:", req.body);
};

module.exports = { createReservation };