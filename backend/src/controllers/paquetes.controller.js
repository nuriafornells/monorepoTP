const Paquete = require('../models/Paquete');
// 🟢 Obtener todos los paquetes
const getAllPackages = async (req, res) => {
  try {
    const paquetes = await Paquete.findAll();
    res.status(200).json(paquetes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener paquetes' });
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
    res.status(200).json(paquete);
  } catch (error) {
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
    res.status(200).json({ publicado: paquete.publicado });
  } catch (error) {
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
    res.status(200).json({ mensaje: 'Paquete eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar paquete' });
  }
};

module.exports = {
  getAllPackages,
  updatePackage,
  togglePublish,
  deletePackage,
};