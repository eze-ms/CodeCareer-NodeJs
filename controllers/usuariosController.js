const { body, validationResult } = require('express-validator');
const Usuarios = require("../models/Usuarios");

// ==============================================
// Renderizar formulario de creación de cuenta
// ==============================================
exports.formCrearCuenta = (req, res) => {
  res.render('crear-cuenta', {
    nombrePagina: 'Crea tu cuenta en CodeCareer',
    tagline: 'Comienza a publicar tus ofertas'
  });
};

// ==============================================
// Validar y sanitizar datos de registro
// ==============================================
exports.validarRegistro = [
  // Sanitizar campos
  body('nombre').escape(),
  body('email').escape(),
  body('password').escape(),
  body('confirmar').escape(),

  // Validar campos
  body('nombre', 'El nombre es obligatorio').notEmpty(),
  body('email', 'El email debe ser válido').isEmail(),
  body('password', 'La contraseña es obligatoria').notEmpty(),
  body('confirmar', 'Confirmar contraseña es obligatorio').notEmpty(),
  body('confirmar').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  }),

  // Manejar errores de validación
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      req.flash('error', errores.array().map(error => error.msg));
      return res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en CodeCareer',
        tagline: 'Comienza a publicar tus ofertas',
        mensajes: req.flash()
      });
    }
    next();
  }
];

// ==============================================
// Crear usuario y manejar posibles errores
// ==============================================
exports.crearUsuario = async (req, res, next) => {
  const usuario = new Usuarios(req.body);
  try {
    await usuario.save();
    res.redirect('/iniciar-sesion'); // Redirigir a la página de inicio de sesión
  } catch (error) {
    req.flash('error', error.message); // Almacenar el mensaje del error
    res.redirect('/crear-cuenta');
  }
};
