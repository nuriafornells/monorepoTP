// src/controllers/reservationController.js
const generarInstrucciones = (reserva) => {
  if (!reserva || reserva.status !== 'aceptada') return null;
  const fechaLimite = new Date(reserva.createdAt);
  fechaLimite.setHours(fechaLimite.getHours() + 48);
  return {
    mensaje: 'Tu reserva fue aceptada',
    numeroReserva: reserva.id,
    paquete: reserva.paquete?.nombre,
    mensaje2: 'Comunicarse al whatsapp indicando su nombre y numero de reserva para concretar el pago',
    contactoWhatsapp: 'https://wa.me/5491112345678',
    numeroWhatsapp: '+54 9 11 1234-5678',
    email: 'pagos@viajes.com',
    metodo: 'Transferencia bancaria o tarjeta de crédito (consultar promociones vigentes)',
    plazo: `Tenés hasta el ${fechaLimite.toLocaleString()} para concretar el pago.`,
  };
};

const createReservation = async (req, res) => {
  try {
    const { packageId, fechaInicio, fechaFin, userId: bodyUserId, cantidadPersonas } = req.body;
    if (!packageId || !cantidadPersonas) {
      return res.status(400).json({ message: 'Faltan datos para la reserva' });
    }

    const em = req.em;
    if (!em) return res.status(500).json({ message: 'ORM no inicializado en la request' });

    const userId = req.user?.role === 'admin' ? Number(bodyUserId || req.user.id) : Number(req.user?.id);
    if (!userId) return res.status(400).json({ message: 'userId inválido' });

    const paquete = await em.findOne('Paquete', packageId);
    const user = await em.findOne('User', userId);
    if (!paquete || !user) return res.status(400).json({ message: 'Paquete o usuario inválido' });

    const repo = em.getRepository('Reservation');
    const now = new Date();

    const nueva = repo.create({
      paquete,
      user,
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
    console.error('Error al crear reserva: ', error);
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

    const safe = reservas.map((r) => {
      const plain = r.toJSON ? r.toJSON() : { ...r };
      const destino = plain.paquete?.hotel?.destino ?? null;
      return {
        ...plain,
        paquete: { ...plain.paquete, destino },
        instrucciones: generarInstrucciones(plain),
      };
    });

    return res.status(200).json({ reservas: safe });
  } catch (error) {
    console.error('Error al obtener reservas: ', error);
    return res.status(500).json({ message: 'Hubo un problema al obtener reservas' });
  }
};

const updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['pendiente', 'aceptada', 'rechazada'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }
  try {
    const repo = req.em.getRepository('Reservation');
    const reserva = await repo.findOne(id, { populate: ['user', 'paquete'] });
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

    reserva.status = status;
    reserva.updatedAt = new Date();

    await req.em.persistAndFlush(reserva);

    return res.status(200).json({
      reserva,
      instrucciones: generarInstrucciones(reserva),
    });
  } catch (error) {
    console.error('Error al actualizar estado de reserva: ', error);
    return res.status(500).json({ error: 'Error al actualizar reserva' });
  }
};

const getReservationsByUser = async (req, res) => {
  try {
    const em = req.em;
    if (!em) return res.status(500).json({ message: 'ORM no inicializado en la request' });

    const userId = Number(req.params.id);
    if (!userId) return res.status(400).json({ message: 'Falta userId' });

    if (req.user?.role !== 'admin' && Number(req.user?.id) !== userId) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const repo = em.getRepository('Reservation');
    const reservas = await repo.find({ user: userId }, { populate: ['paquete', 'paquete.hotel', 'paquete.hotel.destino', 'user'] });

    const safe = reservas.map((r) => {
      const plain = r.toJSON ? r.toJSON() : { ...r };
      const destino = plain.paquete?.hotel?.destino ?? null;
      return {
        ...plain,
        paquete: { ...plain.paquete, destino },
        instrucciones: generarInstrucciones(plain),
      };
    });

    return res.status(200).json({ reservas: safe });
  } catch (error) {
    console.error('Error al obtener reservas del usuario: ', error);
    return res.status(500).json({ message: 'Hubo un problema al obtener reservas' });
  }
};

module.exports = {
  createReservation,
  getReservations,
  updateReservationStatus,
  getReservationsByUser,
};