// src/controllers/hotels.controller.js
// Controladores para manejar hoteles
//la funcionalidad de obtener hoteles ya está en destinos.controller.js, ver si unifican o dejan separados
//la de creAr hotel también está en destinos.controller.js
const getAllHotels = async (req, res) => {
  try {
    const repo = req.em.getRepository('Hotel');
    const hotels = await repo.findAll({ populate: ['destino'] });
    return res.status(200).json({ hoteles: hotels });
  } catch (error) {
    console.error('Error en getAllHotels:', error);
    return res.status(500).json({ error: 'Error al obtener hoteles' });
  }
};

const getHotelsByDestino = async (req, res) => {
  try {
    const repo = req.em.getRepository('Hotel');
    const destinoId = req.query.destinoId ? Number(req.query.destinoId) : null;
    const where = destinoId ? { destino: destinoId } : {};
    const hotels = await repo.find(where, { populate: ['destino'] });
    return res.status(200).json({ hoteles: hotels });
  } catch (error) {
    console.error('Error en getHotelsByDestino:', error);
    return res.status(500).json({ error: 'Error al obtener hoteles' });
  }
};

const getHotelById = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = req.em.getRepository('Hotel');
    const hotel = await repo.findOne(id, { populate: ['destino'] });
    if (!hotel) return res.status(404).json({ error: 'Hotel no encontrado' });
    return res.status(200).json({ hotel });
  } catch (error) {
    console.error('Error en getHotelById:', error);
    return res.status(500).json({ error: 'Error al obtener hotel por ID' });
  }
};

module.exports = {
  getAllHotels,
  getHotelsByDestino,
  getHotelById,
};