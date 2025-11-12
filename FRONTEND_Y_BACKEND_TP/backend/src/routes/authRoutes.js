const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const { login, register } = require("../controllers/authController");
const { handleValidation } = require("../middlewares/validators");
const { loginLimiter } = require("../middlewares/security");
const { verifyToken } = require("../middlewares/auth");

router.post(
  "/login",
  loginLimiter,
  login
);

router.post(
  "/register",
  [
    check("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    check("email").isEmail().withMessage("Email inválido"),
    check("password").isLength({ min: 6 }).withMessage("Contraseña mínima de 6 caracteres"),
    handleValidation,
  ],
  register
);

// Nuevo endpoint para validar sesión y devolver datos públicos del usuario
router.get("/me", verifyToken, async (req, res, next) => {
  try {
    const em = req.em;
    if (!em) return res.status(500).json({ error: "ORM no inicializado en la request" });

    const userRepo = em.getRepository("User");
    const user = await userRepo.findOne(req.user?.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const plain = user.toJSON ? user.toJSON() : { ...user };
    delete plain.password;
    return res.json({
      user: {
        id: plain.id,
        email: plain.email,
        role: plain.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;