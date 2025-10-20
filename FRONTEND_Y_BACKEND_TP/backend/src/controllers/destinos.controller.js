// src/controllers/destinos.controller.js
const { Destino } = require('../models');

const getAllDestinos = async (req, res) => {
  try {
    const destinos = await Destino.findAll();
    res.status(200).json({ destinos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener destinos' });
  }
};

const getDestinoById = async (req, res) => {
  try {
    const destino = await Destino.findByPk(req.params.id);
    if (!destino) return res.status(404).json({ error: 'Destino no encontrado' });
    res.status(200).json({ destino });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener destino' });
  }
};

const createDestino = async (req, res) => {
  try {
    const { nombre, pais, descripcion, imagenUrl, publicado } = req.body;
    if (!nombre || !pais) return res.status(400).json({ error: 'nombre y pais son obligatorios' });
    const destino = await Destino.create({ nombre, pais, descripcion, imagenUrl, publicado });
    res.status(201).json({ destino });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear destino' });
  }
};

const updateDestino = async (req, res) => {
  try {
    const destino = await Destino.findByPk(req.params.id);
    if (!destino) return res.status(404).json({ error: 'Destino no encontrado' });
    await destino.update(req.body);
    res.status(200).json({ destino });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar destino' });
  }
};

const deleteDestino = async (req, res) => {
  try {
    const destino = await Destino.findByPk(req.params.id);
    if (!destino) return res.status(404).json({ error: 'Destino no encontrado' });
    await destino.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar destino' });
  }
};

module.exports = {
  getAllDestinos,
  getDestinoById,
  createDestino,
  updateDestino,
  deleteDestino,
};
