// src/controllers/reservationController.js
const createReservation = async (req, res) => {
  try {
    const { packageId, date, userId, cantidadPersonas, fechaInicio, fechaFin } = req.body;

    // Si usás rango de fechas, aceptá fechaInicio/fechaFin; si no, aceptá date (única fecha)
    if (!packageId || (!date && !(fechaInicio && fechaFin)) || !userId || !cantidadPersonas) {
      return res.status(400).json({ message: 'Faltan datos para la reserva' });
    }

    const em = req.em;
    if (!em) return res.status(500).json({ message: 'ORM no inicializado en la request' });

    const paquete = await em.findOne('Paquete', packageId);
    const user = await em.findOne('User', userId);
    if (!paquete || !user) return res.status(400).json({ message: 'Paquete o usuario inválido' });

    const repo = em.getRepository('Reservation');
    const now = new Date();

    // Si recibís range, guardá fechaInicio/fechaFin; si recibís date, guardá fechaReserva
    const nueva = repo.create({
      paquete,
      user,
      fechaReserva: date ? new Date(date) : null,
      fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
      fechaFin: fechaFin ? new Date(fechaFin) : null,
      cantidadPersonas,
      status: 'pendiente',
      createdAt: now,
      updatedAt: now,
    });

    await em.persistAndFlush(nueva);
    return res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    return res.status(500).json({ message: 'Hubo un problema al crear la reserva' });
  }
};

const getReservations = async (req, res) => {
  try {
    const em = req.em;
    if (!em) return res.status(500).json({ message: 'ORM no inicializado en la request' });

    const repo = em.getRepository('Reservation');
    const where = req.user?.role === 'admin' ? {} : { user: req.user?.id };

    const reservas = await repo.find(where, {
      populate: ['paquete', 'paquete.hotel', 'paquete.hotel.destino', 'user'],
    });

    return res.status(200).json({ reservas });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return res.status(500).json({ message: 'Hubo un problema al obtener reservas' });
  }
};

module.exports = { createReservation, getReservations };