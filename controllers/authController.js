const passport = require('passport');
const Vacante = require('../models/Vacantes');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');

// ==============================================
// Autenticar Usuario
// ==============================================
// Utiliza la estrategia de autenticación local de Passport
exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/administracion', // Redirecciona a /administracion en caso de éxito
  failureRedirect: '/iniciar-sesion', // Redirecciona a /iniciar-sesion en caso de fallo
  failureFlash: true, // Permite mensajes flash en caso de fallo
  badRequestMessage: 'Todos los campos son obligatorios', // Mensaje en caso de campos faltantes
});

// ==============================================
// Revisar si el Usuario está Autenticado
// ==============================================
// Middleware para verificar si el usuario está autenticado
exports.verificarUsuario = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('Usuario autenticado:', req.user); // Agregar este console.log
    return next();
  }
  res.redirect('/iniciar-sesion');
};

// ==============================================
// Mostrar Panel de Administración
// ==============================================
// Renderiza la vista de administración para el usuario autenticado
exports.mostrarPanel = async (req, res) => {
  try {
    const vacantes = await Vacante.find({ autor: req.user._id }); // Asegúrate de convertir el resultado a un objeto plano
    console.log(vacantes); // Añade este console.log para verificar que los IDs están presentes
    res.render('administracion', {
      nombrePagina: 'Panel de Administración',
      tagline: 'Crea y administra tus ofertas',
      cerrarSesion: true,
      nombre: req.user.nombre,
      imagen: req.user.imagen,
      vacantes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el panel de administración');
  }
};

// ==============================================
// Cerrar Sesión del Usuario
// ==============================================
// Renderiza la vista de cerrar sesión para el usuario autenticado
exports.cerrarSesion = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      req.logout((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    req.flash('correcto', 'Cerraste sesión correctamente');
    res.redirect('/iniciar-sesion');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).send('Error al cerrar sesión');
  }
};

// ==============================================
// Formulario para reiniciar el password
// ==============================================
exports.formReestablecerPassword = (req, res) => {
  res.render('reestablecer-password', {
    nombrePagina: 'Reestablece tu contraseña',
    tagline: 'Si has olvidado tu contraseña, ingresa tu email',
  });
};

// ==============================================
// Generar Token
// ==============================================
exports.enviarToken = async (req, res) => {
  try {
    const usuario = await Usuarios.findOne({ email: req.body.email });

    if (!usuario) {
      req.flash('error', 'No existe esa cuenta');
      return res.redirect('/iniciar-sesion');
    }

    // El usuario existe, generar Token
    const token = crypto.randomBytes(20).toString('hex');
    usuario.token = token;
    usuario.expira = Date.now() + 3600000;

    // Guardar usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${token}`;
    console.log(resetUrl);

    // Todo: Enviar notificaciones por email
    req.flash('correcto', 'Revisa tu email para seguir las indicaciones');
    res.redirect('/iniciar-sesion');
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error');
  }
}

