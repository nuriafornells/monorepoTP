// src/controllers/reservationController.js
const { Reservation, Paquete } = require('../models');

// Crear una nueva reserva
const createReservation = async (req, res) => {
  try {
    const { packageId, date, userId } = req.body;
    if (!packageId || !date || !userId) {
      return res.status(400).json({
        message: 'Faltan datos para la reserva (packageId, date, userId)'
      });
    }

    const paquete = await Paquete.findByPk(packageId);
    if (!paquete) {
      return res.status(404).json({ message: 'Paquete no encontrado' });
    }

    if (typeof paquete.cupo === 'number' && paquete.cupo <= 0) {
      return res.status(400).json({
        message: 'No hay cupo disponible para este paquete'
      });
    }

    const nueva = await Reservation.create({
      packageId,
      date,
      userId
    });

    // Decrementar cupo
    if (typeof paquete.cupo === 'number') {
      paquete.cupo -= 1;
      await paquete.save();
    }

    res.status(201).json({ reserva: nueva });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({
      message: 'Hubo un problema al crear la reserva'
    });
  }
};

// Listar reservas filtrando por userId y/o status
const getReservations = async (req, res) => {
  try {
    const { userId, status } = req.query;
    const where = {};

    if (userId) where.userId = Number(userId);
    if (status) where.status = status;

    const reservas = await Reservation.findAll({
      where,
      include: [{ model: Paquete, attributes: ['id', 'nombre'] }]
    });

    res.status(200).json({ reservas });
  } catch (error) {
    console.error('Error en getReservations:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

// Obtener detalle de una reserva por ID
const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reservation.findByPk(id, {
      include: [{ model: Paquete }]
    });

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.status(200).json({ reserva });
  } catch (error) {
    console.error('Error en getReservationById:', error);
    res.status(500).json({ error: 'Error al obtener reserva por ID' });
  }
};

// Actualizar estado de una reserva
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const reserva = await Reservation.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    reserva.status = status;
    await reserva.save();

    res.status(200).json({ reserva });
  } catch (error) {
    console.error('Error en updateReservation:', error);
    res.status(500).json({ error: 'Error al actualizar reserva' });
  }
};

// Eliminar (cancelar) una reserva
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reservation.findByPk(id);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    await reserva.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error en deleteReservation:', error);
    res.status(500).json({ error: 'Error al eliminar reserva' });
  }
};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation
};
