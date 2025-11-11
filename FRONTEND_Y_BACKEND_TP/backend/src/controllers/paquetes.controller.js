// src/controllers/paquetes.controller.js
const path = require('path');

const constructImageURL = (filename) => {
  if (!filename) return null;
  if (typeof filename !== 'string') return null;
  const trimmed = filename.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `http://localhost:3001/images/${trimmed}`;
};

const getAllPackages = async (req, res) => {
  try {
    const repo = req.em.getRepository('Paquete');
    const where = req.user?.role === 'admin' ? {} : { publicado: true };
    const paquetes = await repo.find(where, { populate: ['hotel', 'hotel.destino'] });
    const safe = paquetes.map((p) => {
      const plain = p.toJSON ? p.toJSON() : { ...p };
      // eliminar campos sensibles si existieran
      if (plain.password) delete plain.password;
      return { ...plain, destino: plain.hotel?.destino ?? null };
    });
    return res.status(200).json({ paquetes: safe });
  } catch (error) {
    console.error('Error en getAllPackages : ', error);
    return res.status(500).json({ error: 'Error al obtener paquetes' });
  }
};

const getPublishedPackages = async (req, res) => {
  try {
    const repo = req.em.getRepository('Paquete');
    const paquetes = await repo.find({ publicado: true }, { populate: ['hotel', 'hotel.destino'] });
    const safe = paquetes.map((p) => {
      const plain = p.toJSON ? p.toJSON() : { ...p };
      return { ...plain, destino: plain.hotel?.destino ?? null };
    });
    return res.status(200).json({ paquetes: safe });
  } catch (error) {
    console.error('Error en getPublishedPackages: ', error);
    return res.status(500).json({ error: 'Error al obtener paquetes publicados' });
  }
};

const getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id, { populate: ['hotel', 'hotel.destino'] });
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    const plain = paquete.toJSON ? paquete.toJSON() : { ...paquete };
    // si no está publicado y no es admin, no mostrar
    if (!plain.publicado && req.user?.role !== 'admin') {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }
    const resp = { ...plain, destino: plain.hotel?.destino ?? null };
    return res.status(200).json({ paquete: resp });
  } catch (error) {
    console.error('Error en getPackageById: ', error);
    return res.status(500).json({ error: 'Error al obtener paquete por ID' });
  }
};

const createPackage = async (req, res) => {
  const { nombre, precio, duracion, hotelId, publicado = false, descripcion, fotoURL } = req.body;
  try {
    if (!nombre || precio == null || duracion == null || !hotelId) {
      return res.status(400).json({ error: 'nombre, precio, duracion y hotelId son requeridos' });
    }

    const em = req.em;
    const hotel = await em.findOne('Hotel', hotelId);
    if (!hotel) return res.status(400).json({ error: 'Hotel no encontrado' });

    const repo = em.getRepository('Paquete');
    const now = new Date();
    const fullImageURL = constructImageURL(fotoURL);
    const paquete = repo.create({
      nombre,
      precio,
      duracion,
      descripcion: descripcion ?? null,
      publicado,
      fotoURL: fullImageURL,
      hotel,
      createdAt: now,
      updatedAt: now,
    });

    await em.persistAndFlush(paquete);

    const paqueteConRel = await repo.findOne(paquete.id, { populate: ['hotel', 'hotel.destino'] });
    const plain = paqueteConRel.toJSON ? paqueteConRel.toJSON() : { ...paqueteConRel };
    const resp = { ...plain, destino: plain.hotel?.destino ?? null };
    return res.status(201).json({ paquete: resp });
  } catch (error) {
    console.error('Error en createPackage: ', error);
    return res.status(500).json({ error: 'Error al crear paquete' });
  }
};

const updatePackage = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, duracion, hotelId, publicado, descripcion, fotoURL } = req.body;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id, { populate: ['hotel', 'hotel.destino'] });
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    if (hotelId) {
      const hotel = await req.em.findOne('Hotel', hotelId);
      if (!hotel) return res.status(400).json({ error: 'Hotel no encontrado' });
      paquete.hotel = hotel;
    }

    paquete.nombre = nombre ?? paquete.nombre;
    paquete.precio = precio ?? paquete.precio;
    paquete.duracion = duracion ?? paquete.duracion;
    paquete.descripcion = descripcion ?? paquete.descripcion;
    if (typeof publicado === 'boolean') paquete.publicado = publicado;
    if (fotoURL !== undefined) paquete.fotoURL = constructImageURL(fotoURL);

    paquete.updatedAt = new Date();

    await req.em.persistAndFlush(paquete);

    const paqueteConRel = await repo.findOne(paquete.id, { populate: ['hotel', 'hotel.destino'] });
    const plain = paqueteConRel.toJSON ? paqueteConRel.toJSON() : { ...paqueteConRel };
    const resp = { ...plain, destino: plain.hotel?.destino ?? null };
    return res.status(200).json({ paquete: resp });
  } catch (error) {
    console.error('Error en updatePackage: ', error);
    return res.status(500).json({ error: 'Error al actualizar paquete' });
  }
};

const togglePublish = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    paquete.publicado = !paquete.publicado;
    paquete.updatedAt = new Date();

    await req.em.persistAndFlush(paquete);

    const paqueteConRel = await repo.findOne(paquete.id, { populate: ['hotel', 'hotel.destino'] });
    const plain = paqueteConRel.toJSON ? paqueteConRel.toJSON() : { ...paqueteConRel };
    const resp = { ...plain, destino: plain.hotel?.destino ?? null };
    return res.status(200).json({ paquete: resp });
  } catch (error) {
    console.error('Error en togglePublish: ', error);
    return res.status(500).json({ error: 'Error al cambiar estado de publicación' });
  }
};

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
    console.error('Error en deletePackage: ', error);
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