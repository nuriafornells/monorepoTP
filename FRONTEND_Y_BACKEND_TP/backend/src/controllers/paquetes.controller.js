// src/controllers/paquetes.controller.js
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const { logger } = require('../middlewares/logger');

/**
 * Construye URL completa de la imagen a partir del filename recibido.
 */
function constructImageURL(filename) {
  if (!filename) return null;
  if (typeof filename !== 'string') return null;
  const trimmed = filename.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `http://localhost:3001/images/${trimmed}`;
}

/**
 * getAllPackages
 * - Si el request viene de un admin devuelve más campos (gestión).
 * - Si es usuario público devuelve solo paquetes publicados y campos públicos.
 */
const getAllPackages = async (req, res) => {
  try {
    const role = req.user?.role ? String(req.user.role).toLowerCase() : null;
    const where = role === 'admin' ? {} : { publicado: true };
    const repo = req.em.getRepository('Paquete');

    const paquetes = await repo.find(where, { populate: ['hotel', 'hotel.destino'] });

    const safe = paquetes.map((p) => {
      const plain = p.toJSON ? p.toJSON() : { ...p };

      // Campos públicos mínimos
      const publicView = {
        id: plain.id,
        nombre: plain.nombre,
        precio: plain.precio,
        duracion: plain.duracion ?? null,
        fotoURL: plain.fotoURL ?? null,
        destino: plain.hotel?.destino?.nombre ?? null,
        publicado: Boolean(plain.publicado),
      };

      // Si es admin devolvemos más detalles (sin exponer reservas completas)
      if (role === 'admin') {
        return {
          ...publicView,
          descripcion: plain.descripcion ?? null,
          hotel: plain.hotel ? { id: plain.hotel.id, nombre: plain.hotel.nombre, ubicacion: plain.hotel.ubicacion } : null,
          createdAt: plain.createdAt ?? null,
          updatedAt: plain.updatedAt ?? null,
        };
      }

      return publicView;
    });

    return res.status(200).json({ paquetes: safe });
  } catch (error) {
    logger.error('Error en getAllPackages:', { error: error?.stack || error });
    return res.status(500).json({ error: 'Error al obtener paquetes' });
  }
};

/**
 * getPublishedPackages
 * - Endpoint público: devuelve solo campos públicos mínimos.
 */
const getPublishedPackages = async (req, res) => {
  try {
    const repo = req.em.getRepository('Paquete');
    const paquetes = await repo.find({ publicado: true }, { populate: ['hotel', 'hotel.destino'] });

    const safe = paquetes.map((p) => {
      const plain = p.toJSON ? p.toJSON() : { ...p };
      return {
        id: plain.id,
        nombre: plain.nombre,
        descripcion: plain.descripcion ?? null,
        precio: plain.precio,
        duracion: plain.duracion ?? null,
        fotoURL: constructImageURL(plain.fotoURL),
        destino: plain.hotel?.destino ? {
          id: plain.hotel.destino.id,
          nombre: plain.hotel.destino.nombre
        } : null,
        hotel: plain.hotel ? {
          id: plain.hotel.id,
          nombre: plain.hotel.nombre,
          ubicacion: plain.hotel.ubicacion ?? null
        } : null,
        publicado: true, // Always true since we filter by publicado: true
      };
    });

    return res.status(200).json({ paquetes: safe });
  } catch (error) {
    logger.error('Error en getPublishedPackages:', { error: error?.stack || error });
    return res.status(500).json({ error: 'Error al obtener paquetes publicados' });
  }
};

/**
 * getPackageById
 * - Admin ve cualquier paquete; usuario solo paquetes publicados.
 * - Devuelve vista segura del paquete.
 */
const getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id, { populate: ['hotel', 'hotel.destino'] });
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    const plain = paquete.toJSON ? paquete.toJSON() : { ...paquete };
    if (!plain.publicado && req.user?.role !== 'admin') {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    const resp = {
      id: plain.id,
      nombre: plain.nombre,
      precio: plain.precio,
      duracion: plain.duracion ?? null,
      descripcion: plain.descripcion ?? null,
      fotoURL: plain.fotoURL ?? null,
      publicado: Boolean(plain.publicado),
      destino: plain.hotel?.destino?.nombre ?? null,
      hotel: plain.hotel ? { id: plain.hotel.id, nombre: plain.hotel.nombre, ubicacion: plain.hotel.ubicacion } : null,
      createdAt: plain.createdAt ?? null,
      updatedAt: plain.updatedAt ?? null,
    };

    return res.status(200).json({ paquete: resp });
  } catch (error) {
    logger.error('Error en getPackageById:', { error: error?.stack || error });
    return res.status(500).json({ error: 'Error al obtener paquete por ID' });
  }
};

/**
 * createPackage
 * - Sanitiza strings importantes.
 * - Valida existencia de hotel (ya lo hacías).
 * - Usa constructImageURL para foto.
 */
const createPackage = async (req, res) => {
  try {
    const { nombre, precio, duracion, hotelId, publicado = false, descripcion, fotoURL } = req.body;

    // Validaciones básicas (las reglas de validators.js deberían cubrir esto en la ruta)
    if (!nombre || precio == null || duracion == null || !hotelId) {
      return res.status(400).json({ error: 'nombre, precio, duracion y hotelId son requeridos' });
    }

    const em = req.em;
    const hotel = await em.findOne('Hotel', hotelId);
    if (!hotel) return res.status(400).json({ error: 'Hotel no encontrado' });

    const repo = em.getRepository('Paquete');
    const now = new Date();
    const fullImageURL = constructImageURL(typeof fotoURL === 'string' ? fotoURL.trim() : fotoURL);

    // Sanitizar strings
    const cleanNombre = sanitizeHtml(String(nombre), { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanDescripcion = descripcion ? sanitizeHtml(String(descripcion), { allowedTags: [], allowedAttributes: {} }).trim() : null;

    const paquete = repo.create({
      nombre: cleanNombre,
      precio: Number(precio),
      duracion: Number(duracion),
      descripcion: cleanDescripcion,
      publicado: Boolean(publicado),
      fotoURL: fullImageURL,
      hotel,
      createdAt: now,
      updatedAt: now,
    });

    await em.persistAndFlush(paquete);

    const paqueteConRel = await repo.findOne(paquete.id, { populate: ['hotel', 'hotel.destino'] });
    const plain = paqueteConRel.toJSON ? paqueteConRel.toJSON() : { ...paqueteConRel };
    const resp = {
      id: plain.id,
      nombre: plain.nombre,
      precio: plain.precio,
      duracion: plain.duracion ?? null,
      descripcion: plain.descripcion ?? null,
      fotoURL: plain.fotoURL ?? null,
      publicado: Boolean(plain.publicado),
      destino: plain.hotel?.destino ?? null,
      hotel: plain.hotel ? { id: plain.hotel.id, nombre: plain.hotel.nombre, ubicacion: plain.hotel.ubicacion } : null,
      createdAt: plain.createdAt ?? null,
      updatedAt: plain.updatedAt ?? null,
    };

    return res.status(201).json({ paquete: resp });
  } catch (error) {
    logger.error('Error en createPackage:', { error: error?.stack || error });
    return res.status(500).json({ error: 'Error al crear paquete' });
  }
};

/**
 * updatePackage
 * - Sanitiza y normaliza campos antes de persistir.
 */
const updatePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const { nombre, precio, duracion, hotelId, publicado, descripcion, fotoURL } = req.body;

    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id, { populate: ['hotel', 'hotel.destino'] });
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    if (hotelId) {
      const hotel = await req.em.findOne('Hotel', hotelId);
      if (!hotel) return res.status(400).json({ error: 'Hotel no encontrado' });
      paquete.hotel = hotel;
    }

    if (typeof nombre === 'string') paquete.nombre = sanitizeHtml(nombre, { allowedTags: [], allowedAttributes: {} }).trim();
    if (precio !== undefined) paquete.precio = Number(precio);
    if (duracion !== undefined) paquete.duracion = Number(duracion);
    if (descripcion !== undefined) paquete.descripcion = descripcion ? sanitizeHtml(String(descripcion), { allowedTags: [], allowedAttributes: {} }).trim() : null;
    if (typeof publicado === 'boolean') paquete.publicado = publicado;
    if (fotoURL !== undefined) paquete.fotoURL = constructImageURL(typeof fotoURL === 'string' ? fotoURL.trim() : fotoURL);

    paquete.updatedAt = new Date();

    await req.em.persistAndFlush(paquete);

    const paqueteConRel = await repo.findOne(paquete.id, { populate: ['hotel', 'hotel.destino'] });
    const plain = paqueteConRel.toJSON ? paqueteConRel.toJSON() : { ...paqueteConRel };
    const resp = {
      id: plain.id,
      nombre: plain.nombre,
      precio: plain.precio,
      duracion: plain.duracion ?? null,
      descripcion: plain.descripcion ?? null,
      fotoURL: plain.fotoURL ?? null,
      publicado: Boolean(plain.publicado),
      destino: plain.hotel?.destino ?? null,
      hotel: plain.hotel ? { id: plain.hotel.id, nombre: plain.hotel.nombre, ubicacion: plain.hotel.ubicacion } : null,
      createdAt: plain.createdAt ?? null,
      updatedAt: plain.updatedAt ?? null,
    };

    return res.status(200).json({ paquete: resp });
  } catch (error) {
    logger.error('Error en updatePackage:', { error: error?.stack || error });
    return res.status(500).json({ error: 'Error al actualizar paquete' });
  }
};

/**
 * togglePublish
 */
const togglePublish = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id, { populate: ['hotel', 'hotel.destino'] });
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    paquete.publicado = !Boolean(paquete.publicado);
    paquete.updatedAt = new Date();

    await req.em.persistAndFlush(paquete);

    const plain = paquete.toJSON ? paquete.toJSON() : { ...paquete };
    const resp = {
      id: plain.id,
      nombre: plain.nombre,
      publicado: Boolean(plain.publicado),
      destino: plain.hotel?.destino ?? null,
      fotoURL: plain.fotoURL ?? null,
      updatedAt: plain.updatedAt ?? null,
    };
    return res.status(200).json({ paquete: resp });
  } catch (error) {
    logger.error('Error en togglePublish:', { error: error?.stack || error });
    return res.status(500).json({ error: 'Error al cambiar estado de publicación' });
  }
};

/**
 * deletePackage
 */
const deletePackage = async (req, res) => {
  const { id } = req.params;
  const force = String(req.query.force || '').toLowerCase() === 'true';
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    const reservas = await req.em.find('Reservation', { paquete: id }, { limit: 1 });

    if (reservas.length > 0 && !force) {
      return res.status(409).json({
        error: 'No se puede eliminar el paquete porque tiene reservas asociadas. Usa ?force=true para forzar.',
      });
    }
    if (reservas.length > 0 && force) {
      await req.em.nativeDelete('Reservation', { paquete: id });
    }

    await req.em.removeAndFlush(paquete);

    return res.status(204).send();
  } catch (error) {
    logger.error('Error en deletePackage:', { error: error?.stack || error });
    return res.status(500).json({ error: 'Error al eliminar paquete' });
  }
};

module.exports = {
  getAllPackages,
  getPublishedPackages,
  getPackageById,
  createPackage,
  updatePackage,
  togglePublish,
  deletePackage,
  constructImageURL,
};