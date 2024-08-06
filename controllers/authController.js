const passport = require('passport');
const Vacante = require('../models/Vacantes');

// ==============================================
// Autenticar Usuario
// ==============================================
// Utiliza la estrategia de autenticación local de Passport
exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/administracion', // Redirecciona a /administracion en caso de éxito
  failureRedirect: '/iniciar-sesion', // Redirecciona a /iniciar-sesion en caso de fallo
  failureFlash: true, // Permite mensajes flash en caso de fallo
  badRequestMessage: 'Todos los campos son obligatorios' // Mensaje en caso de campos faltantes
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
}

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
      vacantes
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el panel de administración');
  }
};



// ==============================================
// Renderiza la vista de cerrar sesión
exports.cerrarSesion = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al cerrar sesión');
    }
    req.flash('correcto', 'Cerraste Sesión Correctamente');
    return res.redirect('/iniciar-sesion');
  });
};
