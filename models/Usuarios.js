const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

// ==============================================
// Definición del esquema de usuarios
// ==============================================
const usuariosSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  nombre: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  token: String,
  expira: Date
});

// ==============================================
// Método para hashear los passwords antes de guardar
// ==============================================
usuariosSchema.pre('save', async function(next) {
  if(!this.isModified('password')) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

// ==============================================
// Middleware para manejar errores después de guardar
// ==============================================
usuariosSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Ese correo ya está registrado'));
  } else {
    next(error);
  }
});

// ==============================================
// Exportar el modelo
// ==============================================
module.exports = mongoose.model('Usuarios', usuariosSchema);
