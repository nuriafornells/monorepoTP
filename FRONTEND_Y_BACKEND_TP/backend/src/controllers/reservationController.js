// src/controllers/reservationController.js
const sanitizeHtml = require('sanitize-html');
const { logger } = require('../middlewares/logger');

/**
 * generarInstrucciones
 * Recibe un objeto reserva (plano) y devuelve instrucciones solo si está aceptada.
 */
const generarInstrucciones = (reserva) => {
  if (!reserva || String(reserva.status).toLowerCase() !== 'aceptada') return null;
  const createdAt = reserva.createdAt ? new Date(reserva.createdAt) : null;
  if (!createdAt || isNaN(createdAt.getTime())) return null;

  const fechaLimite = new Date(createdAt);
  fechaLimite.setHours(fechaLimite.getHours() + 48);

  return {
    mensaje: 'Tu reserva fue aceptada',
    numeroReserva: reserva.id,
    paquete: reserva.paquete?.nombre ?? null,
    mensaje2: 'Comunicarse al whatsapp indicando su nombre y numero de reserva para concretar el pago',
    contactoWhatsapp: 'https://wa.me/5491112345678',
    numeroWhatsapp: '+54 9 11 1234-5678',
    email: 'pagos@viajes.com',
    metodo: 'Transferencia bancaria o tarjeta de crédito (consultar promociones vigentes)',
    plazo: `Tenés hasta el ${fechaLimite.toLocaleString()} para concretar el pago.`,
  };
};

/**
 * createReservation
 * Crea una reserva validando y normalizando los datos, y devuelve un objeto seguro.
 */
const createReservation = async (req, res) => {
  try {
    const { packageId, fechaInicio, fechaFin, userId: bodyUserId, cantidadPersonas } = req.body;

    // Validaciones básicas de tipo
    const pkgId = Number(packageId);
    const qty = Number(cantidadPersonas);
    if (!pkgId || pkgId <= 0 || !qty || qty <= 0) {
      return res.status(400).json({ message: 'packageId y cantidadPersonas son requeridos y deben ser válidos' });
    }

    // Validar fechas opcionales
    let inicio = null;
    let fin = null;
    if (fechaInicio) {
      inicio = new Date(fechaInicio);
      if (isNaN(inicio.getTime())) return res.status(400).json({ message: 'fechaInicio inválida' });
    }
    if (fechaFin) {
      fin = new Date(fechaFin);
      if (isNaN(fin.getTime())) return res.status(400).json({ message: 'fechaFin inválida' });
    }

    const em = req.em;
    if (!em) return res.status(500).json({ message: 'ORM no inicializado en la request' });

    // Determinar userId: admin puede pasar userId, usuario normal usa su propio id
    const userId = req.user?.role === 'admin' ? Number(bodyUserId || req.user.id) : Number(req.user?.id);
    if (!userId || userId <= 0) return res.status(400).json({ message: 'userId inválido' });

    // Buscar paquete y usuario
    const paquete = await em.findOne('Paquete', pkgId);
    const user = await em.findOne('User', userId);
    if (!paquete || !user) return res.status(400).json({ message: 'Paquete o usuario inválido' });

    const repo = em.getRepository('Reservation');
    const now = new Date();

    const nueva = repo.create({
      paquete,
      user,
      fechaInicio: inicio,
      fechaFin: fin,
      cantidadPersonas: qty,
      status: 'pendiente',
      createdAt: now,
      updatedAt: now,
    });

    await em.persistAndFlush(nueva);

    // Recuperar con relaciones necesarias para armar la respuesta segura
    const saved = await repo.findOne(nueva.id, { populate: ['paquete', 'paquete.hotel', 'paquete.hotel.destino', 'user'] });
    const plain = saved && saved.toJSON ? saved.toJSON() : { ...saved };

    const safePaquete = {
      id: plain.paquete?.id ?? null,
      nombre: plain.paquete?.nombre ?? null,
      precio: plain.paquete?.precio ?? null,
      destino: plain.paquete?.hotel?.destino?.nombre ?? null,
      fotoURL: plain.paquete?.fotoURL ?? null,
    };

    const safeUser = {
      id: plain.user?.id ?? null,
      name: plain.user?.name ?? null,
      email: plain.user?.email ?? null,
    };

    const resp = {
      id: plain.id,
      paquete: safePaquete,
      user: safeUser,
      fechaInicio: plain.fechaInicio ?? null,
      fechaFin: plain.fechaFin ?? null,
      cantidadPersonas: plain.cantidadPersonas,
      status: plain.status,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
      instrucciones: generarInstrucciones(plain),
    };

    return res.status(201).json(resp);
  } catch (error) {
    logger.error('Error al crear reserva', { error: error?.stack || error });
    return res.status(500).json({ message: 'Hubo un problema al crear la reserva' });
  }
};

/**
 * getReservations
 * Devuelve reservas del usuario o todas si es admin, con objetos seguros.
 */
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
      const safePaquete = {
        id: plain.paquete?.id ?? null,
        nombre: plain.paquete?.nombre ?? null,
        precio: plain.paquete?.precio ?? null,
        destino: plain.paquete?.hotel?.destino?.nombre ?? null,
        fotoURL: plain.paquete?.fotoURL ?? null,
      };
      const safeUser = {
        id: plain.user?.id ?? null,
        name: plain.user?.name ?? null,
        email: plain.user?.email ?? null,
      };
      return {
        id: plain.id,
        paquete: safePaquete,
        user: safeUser,
        fechaInicio: plain.fechaInicio ?? null,
        fechaFin: plain.fechaFin ?? null,
        cantidadPersonas: plain.cantidadPersonas,
        status: plain.status,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
        instrucciones: generarInstrucciones(plain),
      };
    });

    return res.status(200).json({ reservas: safe });
  } catch (error) {
    logger.error('Error al obtener reservas', { error: error?.stack || error });
    return res.status(500).json({ message: 'Hubo un problema al obtener reservas' });
  }
};

/**
 * updateReservationStatus
 * Solo cambia el estado y devuelve la reserva segura con instrucciones.
 */
const updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  let { status } = req.body;
  if (typeof status !== 'string') return res.status(400).json({ error: 'Estado inválido' });

  status = status.trim().toLowerCase();
  const allowed = ['pendiente', 'aceptada', 'rechazada'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const repo = req.em.getRepository('Reservation');
    const reserva = await repo.findOne(id, { populate: ['user', 'paquete', 'paquete.hotel', 'paquete.hotel.destino'] });
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

    reserva.status = status;
    reserva.updatedAt = new Date();

    await req.em.persistAndFlush(reserva);

    const plain = reserva.toJSON ? reserva.toJSON() : { ...reserva };
    const safePaquete = {
      id: plain.paquete?.id ?? null,
      nombre: plain.paquete?.nombre ?? null,
      precio: plain.paquete?.precio ?? null,
      destino: plain.paquete?.hotel?.destino?.nombre ?? null,
      fotoURL: plain.paquete?.fotoURL ?? null,
    };
    const safeUser = {
      id: plain.user?.id ?? null,
      name: plain.user?.name ?? null,
      email: plain.user?.email ?? null,
    };

    const resp = {
      id: plain.id,
      paquete: safePaquete,
      user: safeUser,
      fechaInicio: plain.fechaInicio ?? null,
      fechaFin: plain.fechaFin ?? null,
      cantidadPersonas: plain.cantidadPersonas,
      status: plain.status,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
      instrucciones: generarInstrucciones(plain),
    };

    return res.status(200).json(resp);
  } catch (error) {
    logger.error('Error al actualizar estado de reserva', { error: error?.stack || error });
    return res.status(500).json({ error: 'Error al actualizar reserva' });
  }
};

/**
 * getReservationsByUser
 * Devuelve reservas de un usuario específico (admin o el propio usuario).
 */
const getReservationsByUser = async (req, res) => {
  try {
    const em = req.em;
    if (!em) return res.status(500).json({ message: 'ORM no inicializado en la request' });

    const userId = Number(req.params.id);
    if (!userId || userId <= 0) return res.status(400).json({ message: 'Falta userId' });

    if (req.user?.role !== 'admin' && Number(req.user?.id) !== userId) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const repo = em.getRepository('Reservation');
    const reservas = await repo.find({ user: userId }, { populate: ['paquete', 'paquete.hotel', 'paquete.hotel.destino', 'user'] });

    const safe = reservas.map((r) => {
      const plain = r.toJSON ? r.toJSON() : { ...r };
      const safePaquete = {
        id: plain.paquete?.id ?? null,
        nombre: plain.paquete?.nombre ?? null,
        precio: plain.paquete?.precio ?? null,
        destino: plain.paquete?.hotel?.destino?.nombre ?? null,
        fotoURL: plain.paquete?.fotoURL ?? null,
      };
      const safeUser = {
        id: plain.user?.id ?? null,
        name: plain.user?.name ?? null,
        email: plain.user?.email ?? null,
      };
      return {
        id: plain.id,
        paquete: safePaquete,
        user: safeUser,
        fechaInicio: plain.fechaInicio ?? null,
        fechaFin: plain.fechaFin ?? null,
        cantidadPersonas: plain.cantidadPersonas,
        status: plain.status,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
        instrucciones: generarInstrucciones(plain),
      };
    });

    return res.status(200).json({ reservas: safe });
  } catch (error) {
    logger.error('Error al obtener reservas del usuario', { error: error?.stack || error });
    return res.status(500).json({ message: 'Hubo un problema al obtener reservas' });
  }
};

module.exports = {
  createReservation,
  getReservations,
  updateReservationStatus,
  getReservationsByUser,
};