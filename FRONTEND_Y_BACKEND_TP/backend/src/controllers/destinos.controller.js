// backend/src/controllers/destinos.controller.js
// Controladores para manejar destinos y hoteles
// ver de unifiicar con hotels.controller.js si es posible
const getDestinos = async (req, res) => { // obtiene todos los destinos
  try {
    const destinos = await req.em.find('Destino', {}); 
    return res.status(200).json({ destinos });
  } catch (error) {
    console.error('Error en getDestinos:', error);
    return res.status(500).json({ error: 'Error al obtener destinos' });
  }
};

const getHoteles = async (req, res) => { // obtiene todos los hoteles, con filtro opcional por destinoId
  try {
    const destinoId = req.query.destinoId ? Number(req.query.destinoId) : null;
    const where = destinoId ? { destino: destinoId } : {}; // filtro opcional
    const hoteles = await req.em.find('Hotel', where, { populate: ['destino'] });
    return res.status(200).json({ hoteles });
  } catch (error) {
    console.error('Error en getHoteles:', error);
    return res.status(500).json({ error: 'Error al obtener hoteles' });
  }
};

const createDestino = async (req, res) => { // crea un nuevo destino
  try {
    console.log("👉 BODY recibido en createDestino:", req.body);

    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' }); 
    }

    const destino = req.em.create('Destino', { nombre }); // ✅
    await req.em.persistAndFlush(destino);                // ✅

    return res.status(201).json({ destino });
  } catch (error) {
    console.error('❌ Error en createDestino:', error);
    return res.status(500).json({ error: 'Error al crear destino' });
  }
};

const createHotel = async (req, res) => {
  try {
    console.log("👉 BODY recibido en createHotel:", req.body);

    const { nombre, ubicacion, destinoId } = req.body; 
    if (!nombre || !ubicacion || !destinoId) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const destino = await req.em.findOne('Destino', { id: destinoId }); 
    if (!destino) {
      return res.status(404).json({ error: 'Destino no encontrado' });
    }

    const hotel = req.em.create('Hotel', { nombre, ubicacion, destino }); 
    await req.em.persistAndFlush(hotel);                                  

    return res.status(201).json({ hotel });
  } catch (error) {
    console.error('❌ Error en createHotel:', error);
    return res.status(500).json({ error: 'Error al crear hotel' });
  }
};

module.exports = {
  getDestinos,
  getHoteles,
  createDestino,
  createHotel,
};