// src/controllers/paquetes.controller.js
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
    const paquetes = await repo.findAll({ populate: ['hotel', 'destino'] });
    return res.status(200).json({ paquetes });
  } catch (error) {
    console.error('Error en getAllPackages:', error);
    return res.status(500).json({ error: 'Error al obtener paquetes' });
  }
};

const getPublishedPackages = async (req, res) => {
  try {
    const repo = req.em.getRepository('Paquete');
    const paquetes = await repo.find({ publicado: true }, { populate: ['hotel', 'destino'] });
    return res.status(200).json({ paquetes });
  } catch (error) {
    console.error('Error en getPublishedPackages:', error);
    return res.status(500).json({ error: 'Error al obtener paquetes publicados' });
  }
};

const getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id, { populate: ['hotel', 'destino'] });
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    return res.status(200).json({ paquete });
  } catch (error) {
    console.error('Error en getPackageById:', error);
    return res.status(500).json({ error: 'Error al obtener paquete por ID' });
  }
};

const createPackage = async (req, res) => {
  const { nombre, precio, duracion, hotelId, destinoId, publicado = false, descripcion, fechaInicio, fechaFin, fotoURL } = req.body;
  try {
    if (!hotelId) return res.status(400).json({ error: 'hotelId es requerido' });
    if (!destinoId) return res.status(400).json({ error: 'destinoId es requerido' });

    const em = req.em;
    const hotel = await em.findOne('Hotel', hotelId);
    if (!hotel) return res.status(400).json({ error: 'Hotel no encontrado' });

    const destino = await em.findOne('Destino', destinoId);
    if (!destino) return res.status(400).json({ error: 'Destino no encontrado' });

    const repo = em.getRepository('Paquete');
    const now = new Date();
    const fullImageURL = constructImageURL(fotoURL);

    const paquete = repo.create({
      nombre,
      precio,
      duracion,
      descripcion: descripcion ?? null,
      fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
      fechaFin: fechaFin ? new Date(fechaFin) : null,
      publicado,
      fotoURL: fullImageURL,
      destino,
      hotel,
      createdAt: now,
      updatedAt: now,
    });

    await em.persistAndFlush(paquete);
    return res.status(201).json({ paquete });
  } catch (error) {
    console.error('Error en createPackage:', error);
    return res.status(500).json({ error: 'Error al crear paquete' });
  }
};

const updatePackage = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, duracion, hotelId, destinoId, publicado, descripcion, fechaInicio, fechaFin, fotoURL } = req.body;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id, { populate: ['hotel', 'destino'] });
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    if (hotelId) {
      const hotel = await req.em.findOne('Hotel', hotelId);
      if (!hotel) return res.status(400).json({ error: 'Hotel no encontrado' });
      paquete.hotel = hotel;
    }

    if (destinoId) {
      const destino = await req.em.findOne('Destino', destinoId);
      if (!destino) return res.status(400).json({ error: 'Destino no encontrado' });
      paquete.destino = destino;
    }

    paquete.nombre = nombre ?? paquete.nombre;
    paquete.precio = precio ?? paquete.precio;
    paquete.duracion = duracion ?? paquete.duracion;
    paquete.descripcion = descripcion ?? paquete.descripcion;
    paquete.fechaInicio = fechaInicio ? new Date(fechaInicio) : paquete.fechaInicio;
    paquete.fechaFin = fechaFin ? new Date(fechaFin) : paquete.fechaFin;
    if (typeof publicado === 'boolean') paquete.publicado = publicado;
    if (fotoURL !== undefined) paquete.fotoURL = constructImageURL(fotoURL);
    paquete.updatedAt = new Date();

    await req.em.persistAndFlush(paquete);
    return res.status(200).json({ paquete });
  } catch (error) {
    console.error('Error en updatePackage:', error);
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
    return res.status(200).json({ paquete });
  } catch (error) {
    console.error('Error en togglePublish:', error);
    return res.status(500).json({ error: 'Error al cambiar estado de publicación' });
  }
};

const deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    const reservas = await req.em.find('Reservation', { paquete: id }, { limit: 1 });
    if (reservas.length > 0) {
      return res.status(409).json({ error: 'No se puede eliminar el paquete porque tiene reservas asociadas' });
    }

    await req.em.removeAndFlush(paquete);
    return res.status(204).send();
  } catch (error) {
    console.error('Error en deletePackage:', error);
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
};