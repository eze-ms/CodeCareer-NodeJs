const passport = require('passport'); // Para autenticación de usuarios
const LocalStrategy = require('passport-local').Strategy; // Para utilizar la estrategia de autenticación local
const mongoose = require('mongoose'); // Para interactuar con MongoDB
const Usuarios = mongoose.model('Usuarios'); // Para realizar consultas y verificar la existencia de un usuario

// ==============================================
// Definir la estrategia local de Passport para la autenticación
// ==============================================
passport.use(new LocalStrategy({
  usernameField: 'email', // Definimos el campo del formulario que será utilizado como nombre de usuario
  passwordField: 'password' // Definimos el campo del formulario que será utilizado como contraseña
}, async (email, password, done) => {
  const usuario = await Usuarios.findOne({ email }); // Buscar usuario por email

  // Si el usuario no existe
  if (!usuario) return done(null, false, {
    message: 'Usuario No Existe'
  });

  // Si el usuario existe, verificar la contraseña
  const verificarPass = await usuario.compararPassword(password); // Comparar la contraseña ingresada con la almacenada
  if (!verificarPass) return done(null, false, {
    message: 'Password Incorrecto'
  });

  // Autenticación exitosa
  return done(null, usuario);
}));

// ==============================================
// Serializar y deserializar usuario para sesiones de Passport
// ==============================================
passport.serializeUser((usuario, done) => done(null, usuario._id)); // Serializar el usuario almacenando su ID

passport.deserializeUser(async (id, done) => {
  const usuario = await Usuarios.findById(id); // Deserializar usuario buscando por ID
  return done(null, usuario);
});

module.exports = passport;
