// Using MikroORM repository via request-scoped EntityManager (req.em)

// 🟢 Obtener todos los paquetes (admin)
const getAllPackages = async (req, res) => {
  try {
    const repo = req.em.getRepository('Paquete');
    const paquetes = await repo.findAll();
    res.status(200).json({ paquetes });
  } catch (error) {
    console.error('Error en getAllPackages:', error);
    res.status(500).json({ error: 'Error al obtener paquetes' });
  }
};

// 🟢 Obtener solo paquetes publicados (cliente)
const getPublishedPackages = async (req, res) => {
  try {
    const repo = req.em.getRepository('Paquete');
    const paquetes = await repo.find({ publicado: true });
    res.status(200).json({ paquetes });
  } catch (error) {
    console.error('Error en getPublishedPackages:', error);
    res.status(500).json({ error: 'Error al obtener paquetes publicados' });
  }
};

// 🔍 Obtener un paquete por ID
const getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    res.status(200).json({ paquete });
  } catch (error) {
    console.error('Error en getPackageById:', error);
    res.status(500).json({ error: 'Error al obtener paquete por ID' });
  }
};

// 📌 Crear un nuevo paquete
const createPackage = async (req, res) => {
  const { nombre, destino, precio, duracion, publicado = false } = req.body;
  try {
    const repo = req.em.getRepository('Paquete');
  const now = new Date();
  const paquete = repo.create({ nombre, destino, precio, duracion, publicado, createdAt: now, updatedAt: now });
  await req.em.persistAndFlush(paquete);
    return res.status(201).json({ paquete });
  } catch (error) {
    console.error('Error en createPackage:', error);
    return res.status(500).json({ error: 'Error al crear paquete' });
  }
};

// 🟡 Actualizar un paquete
const updatePackage = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, destino, duracion } = req.body;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    paquete.nombre = nombre ?? paquete.nombre;
    paquete.precio = precio ?? paquete.precio;
    paquete.destino = destino ?? paquete.destino;
    paquete.duracion = duracion ?? paquete.duracion;
    await req.em.persistAndFlush(paquete);
    res.status(204).send();
  } catch (error) {
    console.error('Error en updatePackage:', error);
    res.status(500).json({ error: 'Error al actualizar paquete' });
  }
};

// 🟣 Publicar o despublicar
const togglePublish = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    paquete.publicado = !paquete.publicado;
    await req.em.persistAndFlush(paquete);
    res.status(200).json(paquete);
  } catch (error) {
    console.error('Error en togglePublish:', error);
    res.status(500).json({ error: 'Error al cambiar estado de publicación' });
  }
};

// 🔴 Eliminar paquete
const deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = req.em.getRepository('Paquete');
    const paquete = await repo.findOne(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    await req.em.removeAndFlush(paquete);
    res.status(204).send();
  } catch (error) {
    console.error('Error en deletePackage:', error);
    res.status(500).json({ error: 'Error al eliminar paquete' });
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