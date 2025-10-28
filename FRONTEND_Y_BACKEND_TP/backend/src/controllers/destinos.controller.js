// src/controllers/destinos.controller.js

const getDestinos = async (req, res) => {
  try {
    const repo = req.em.getRepository('Destino');
    const destinos = await repo.findAll();
    return res.status(200).json({ destinos });
  } catch (error) {
    console.error('Error en getDestinos:', error);
    return res.status(500).json({ error: 'Error al obtener destinos' });
  }
};

const getHoteles = async (req, res) => {
  try {
    const repo = req.em.getRepository('Hotel');
    const destinoId = req.query.destinoId ? Number(req.query.destinoId) : null;

    const where = destinoId ? { destino: destinoId } : {};
    const hoteles = await repo.find(where, { populate: ['destino'] });

    return res.status(200).json({ hoteles });
  } catch (error) {
    console.error('Error en getHoteles:', error);
    return res.status(500).json({ error: 'Error al obtener hoteles' });
  }
};

module.exports = {
  getDestinos,
  getHoteles,
};