const passport = require('passport');

exports.autenticarUsuario = passport.authenticate('local', {
  seccessRedirect: '/administracion',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true, 
  badRequestMessage: 'Todos los campos son obligarios'
})