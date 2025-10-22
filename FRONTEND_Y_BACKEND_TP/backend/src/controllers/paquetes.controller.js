// src/controllers/paquetes.controller.js
const getAllPackages = async (req, res) => {
  try {
    const repo = req.em.getRepository('Paquete');
    const paquetes = await repo.findAll();
    return res.status(200).json({ paquetes });
  } catch (error) {
    console.error('Error en getAllPackages:', error);
    return res.status(500).json({ error: 'Error al obtener paquetes' });
  }
};

const getPublishedPackages = async (req, res) => {
  try {
    const repo = req.em.getRepository('Paquete');
    const paquetes = await repo.find({ publicado: true });
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
    const paquete = await repo.findOne(id, { populate: ['hotel', 'hotel.destino'] });
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    return res.status(200).json({ paquete });
  } catch (error) {
    console.error('Error en getPackageById:', error);
    return res.status(500).json({ error: 'Error al obtener paquete por ID' });
  }
};

const createPackage = async (req, res) => {
  const { nombre, precio, duracion, hotelId, publicado = false, descripcion, fechaInicio, fechaFin } = req.body;
  try {
    if (!hotelId) {
      return res.status(400).json({ error: 'hotelId es requerido' });
    }

    const em = req.em;
    const hotel = await em.findOne('Hotel', hotelId);
    if (!hotel) return res.status(400).json({ error: 'Hotel no encontrado' });

    const repo = em.getRepository('Paquete');
    const now = new Date();
    const paquete = repo.create({
      nombre,
      precio,
      duracion,
      descripcion: descripcion ?? null,
      fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
      fechaFin: fechaFin ? new Date(fechaFin) : null,
      publicado,
      hotel,
      createdAt: now,
      updatedAt: now,
    });

    await req.em.persistAndFlush(paquete);
    return res.status(201).json({ paquete });
  } catch (error) {
    console.error('Error en createPackage:', error);
    return res.status(500).json({ error: 'Error al crear paquete' });
  }
};

const updatePackage = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, duracion, hotelId, publicado, descripcion, fechaInicio, fechaFin } = req.body;

  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id, { populate: ['hotel'] });
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
    paquete.fechaInicio = fechaInicio ? new Date(fechaInicio) : paquete.fechaInicio;
    paquete.fechaFin = fechaFin ? new Date(fechaFin) : paquete.fechaFin;
    if (typeof publicado === 'boolean') paquete.publicado = publicado;
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
    return res.status(200).json(paquete);
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
    if (!paquete) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    // Verificamos si hay reservas asociadas
    const reservas = await req.em.find('Reservation', { paquete: id }, { limit: 1 });
    if (reservas.length > 0) {
      return res.status(409).json({
        error: 'No se puede eliminar el paquete porque tiene reservas asociadas',
      });
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