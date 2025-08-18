const sequelize = require('../config/db');
const { Paquete } = require('../models/initModels')(sequelize);

// 🟢 Obtener todos los paquetes
const getAllPackages = async (req, res) => {
  try {
    const paquetes = await Paquete.findAll();
    res.status(200).json({ paquetes });
  } catch (error) {
    console.error("Error en getAllPackages:", error);
    res.status(500).json({ error: 'Error al obtener paquetes' });
  }
};

// 🔍 Obtener un paquete por ID
const getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const paquete = await Paquete.findByPk(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    res.status(200).json({ paquete });
  } catch (error) {
    console.error("Error en getPackageById:", error);
    res.status(500).json({ error: 'Error al obtener paquete por ID' });
  }
};

// 📌 Crear un nuevo paquete
const createPackage = async (req, res) => {
  const { nombre, destino, precio, duracion, publicado = false } = req.body;
  try {
    const paquete = await Paquete.create({ nombre, destino, precio, duracion, publicado });
    return res.status(201).json({ paquete });
  } catch (error) {
    console.error("Error en createPackage:", error);
    return res.status(500).json({ error: 'Error al crear paquete' });
  }
};

// 🟡 Actualizar un paquete
const updatePackage = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, destino, duracion } = req.body;
  try {
    const paquete = await Paquete.findByPk(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    await paquete.update({ nombre, precio, destino, duracion });
    res.status(204).send();
  } catch (error) {
    console.error("Error en updatePackage:", error);
    res.status(500).json({ error: 'Error al actualizar paquete' });
  }
};

// 🟣 Publicar o despublicar
const togglePublish = async (req, res) => {
  const { id } = req.params;
  try {
    const paquete = await Paquete.findByPk(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    await paquete.update({ publicado: !paquete.publicado });
    res.status(200).json(paquete);
  } catch (error) {
    console.error("Error en togglePublish:", error);
    res.status(500).json({ error: 'Error al cambiar estado de publicación' });
  }
};

// 🔴 Eliminar paquete
const deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const paquete = await Paquete.findByPk(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    await paquete.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error en deletePackage:", error);
    res.status(500).json({ error: 'Error al eliminar paquete' });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  togglePublish,
  deletePackage,
};