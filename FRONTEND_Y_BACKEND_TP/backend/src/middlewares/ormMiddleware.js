module.exports = (orm) => (req, res, next) => { 
  req.em = orm.em.fork();
  next();
};
// Middleware  para inyectar el EntityManager por request, 
// q sirve para manejar transacciones y el contexto de la bd