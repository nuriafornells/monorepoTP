// src/controllers/paquetes.controller.js
const { Op } = require('sequelize');
const { Paquete, Destino } = require('../models');

// Obtener todos los paquetes (admin)
const getAllPackages = async (req, res) => {
  try {
    const paquetes = await Paquete.findAll({
      include: [{ model: Destino, as: 'destino' }]
    });
    res.status(200).json({ paquetes });
  } catch (error) {
    console.error('Error en getAllPackages:', error);
    res.status(500).json({ error: 'Error al obtener todos los paquetes' });
  }
};

// Obtener solo paquetes publicados con filtros dinámicos
const getPublishedPackages = async (req, res) => {
  try {
    const { destinoId, precioMin, precioMax, duracionMin, duracionMax } = req.query;
    const where = { publicado: true };

    if (destinoId) {
      where.destinoId = Number(destinoId);
    }

    if (precioMin || precioMax) {
      where.precio = {};
      if (precioMin) where.precio[Op.gte] = Number(precioMin);
      if (precioMax) where.precio[Op.lte] = Number(precioMax);
    }

    if (duracionMin || duracionMax) {
      where.duracion = {};
      if (duracionMin) where.duracion[Op.gte] = Number(duracionMin);
      if (duracionMax) where.duracion[Op.lte] = Number(duracionMax);
    }

    const paquetes = await Paquete.findAll({
      where,
      include: [{ model: Destino, as: 'destino' }]
    });

    res.status(200).json({ paquetes });
  } catch (error) {
    console.error('Error en getPublishedPackages filtrado:', error);
    res.status(500).json({ error: 'Error al obtener paquetes filtrados' });
  }
};

// Obtener un paquete por ID
const getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const paquete = await Paquete.findByPk(id, {
      include: [{ model: Destino, as: 'destino' }]
    });
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });
    res.status(200).json({ paquete });
  } catch (error) {
    console.error('Error en getPackageById:', error);
    res.status(500).json({ error: 'Error al obtener paquete por ID' });
  }
};

// Crear nuevo paquete (acepta destinoId o destino)
const createPackage = async (req, res) => {
  try {
    const {
      nombre,
      destinoId,
      destino,
      precio,
      duracion,
      publicado = false,
      cupo = 10,
      crearDestinoSiNoExiste = false
    } = req.body;

    // Validaciones mínimas
    if (!nombre || (!destinoId && !destino) || !precio || !duracion) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: nombre, destinoId|destino, precio, duracion'
      });
    }

    // Resolver destinoId si vino destino
    let finalDestinoId = destinoId;
    if (!finalDestinoId && destino) {
      const encontrado = await Destino.findOne({ where: { nombre: destino } });
      if (encontrado) finalDestinoId = encontrado.id;
      else if (crearDestinoSiNoExiste) {
        const nuevo = await Destino.create({ nombre: destino, pais: 'Desconocido' });
        finalDestinoId = nuevo.id;
      }
    }

    if (!finalDestinoId) {
      return res.status(400).json({
        error: 'Destino inválido o no encontrado (envía destinoId o destino)'
      });
    }

    const destinoObj = await Destino.findByPk(finalDestinoId);
    if (!destinoObj) return res.status(404).json({ error: 'Destino no encontrado' });

    const paquete = await Paquete.create({
      nombre,
      destinoId: finalDestinoId,
      precio,
      duracion,
      publicado,
      cupo
    });

    const paqueteConDestino = await Paquete.findByPk(paquete.id, {
      include: [{ model: Destino, as: 'destino' }]
    });
    return res.status(201).json({ paquete: paqueteConDestino });
  } catch (error) {
    console.error('Error en createPackage:', error);
    return res.status(500).json({ error: 'Error al crear paquete' });
  }
};

// Actualizar un paquete (acepta destinoId o destino)
const updatePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      nombre,
      precio,
      destinoId,
      destino,
      duracion,
      publicado,
      cupo,
      crearDestinoSiNoExiste = false
    } = req.body;

    const paquete = await Paquete.findByPk(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    // Resolver destinoId si vino destino
    let finalDestinoId = destinoId;
    if (!finalDestinoId && destino) {
      const encontrado = await Destino.findOne({ where: { nombre: destino } });
      if (encontrado) finalDestinoId = encontrado.id;
      else if (crearDestinoSiNoExiste) {
        const nuevo = await Destino.create({ nombre: destino, pais: 'Desconocido' });
        finalDestinoId = nuevo.id;
      }
    }

    if (finalDestinoId) {
      const destinoObj = await Destino.findByPk(finalDestinoId);
      if (!destinoObj) return res.status(404).json({ error: 'Destino no encontrado' });
    }

    await paquete.update({
      nombre: nombre ?? paquete.nombre,
      precio: precio ?? paquete.precio,
      destinoId: finalDestinoId ?? paquete.destinoId,
      duracion: duracion ?? paquete.duracion,
      publicado: typeof publicado === 'boolean' ? publicado : paquete.publicado,
      cupo: cupo ?? paquete.cupo
    });

    const actualizado = await Paquete.findByPk(id, {
      include: [{ model: Destino, as: 'destino' }]
    });
    res.status(200).json({ paquete: actualizado });
  } catch (error) {
    console.error('Error en updatePackage:', error);
    res.status(500).json({ error: 'Error al actualizar paquete' });
  }
};

// Publicar/despublicar un paquete
const togglePublish = async (req, res) => {
  const { id } = req.params;
  try {
    const paquete = await Paquete.findByPk(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    paquete.publicado = !paquete.publicado;
    await paquete.save();
    res.status(200).json(paquete);
  } catch (error) {
    console.error('Error en togglePublish:', error);
    res.status(500).json({ error: 'Error al cambiar estado de publicación' });
  }
};

// Eliminar un paquete
const deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const paquete = await Paquete.findByPk(id);
    if (!paquete) return res.status(404).json({ error: 'Paquete no encontrado' });

    await paquete.destroy();
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
  deletePackage
};
