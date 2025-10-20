const createReservation = async (req, res) => {
  try {
    const { packageId, date, userId } = req.body;

    if (!packageId || !date || !userId) {
      return res.status(400).json({ message: "Faltan datos para la reserva" });
    }

    const em = req.em;
    if (!em) return res.status(500).json({ message: 'ORM no inicializado en la request' });

    const paquete = await em.findOne('Paquete', packageId);
    const user = await em.findOne('User', userId);
    if (!paquete || !user) return res.status(400).json({ message: 'Paquete o usuario inválido' });

    const repo = em.getRepository('Reservation');
    const now = new Date();
    const nueva = repo.create({ paquete, user, date: new Date(date), createdAt: now, updatedAt: now });
    await em.persistAndFlush(nueva);

    res.status(201).json(nueva);
  } catch (error) {
    console.error("❌ Error al crear reserva:", error);
    res.status(500).json({ message: "Hubo un problema al crear la reserva" });
  }
  console.log("📩 Reserva recibida:", req.body);
};

module.exports = { createReservation };