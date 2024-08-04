const passport = require('passport');

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
  // Revisar el usuario
  if (req.isAuthenticated()) {
    return next(); // Si está autenticado, pasa al siguiente middleware
  }
  // Redireccionar
  res.redirect('/iniciar-sesion'); // Si no está autenticado, redirecciona a /iniciar-sesion
}

// ==============================================
// Mostrar Panel de Administración
// ==============================================
// Renderiza la vista de administración para el usuario autenticado
exports.mostrarPanel = (req, res) => {
  res.render('administracion', {
    nombrePagina: 'Panel de Administración', // Título de la página
    tagline: 'Crea y administra tus ofertas' // Slogan o descripción
  });
}
