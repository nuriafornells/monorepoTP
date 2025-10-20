module.exports = (orm) => (req, res, next) => {
  req.em = orm.em.fork();
  next();
};
