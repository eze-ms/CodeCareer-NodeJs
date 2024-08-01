// ==============================================
// Importar módulos necesarios
// ==============================================
const mongoose = require('mongoose'); // Importar Mongoose para interactuar con MongoDB
mongoose.Promise = global.Promise; // Usar promesas nativas de ES6 con Mongoose
const slug = require('slug'); // Importar slug para generar URLs amigables
const shortid = require('shortid'); // Importar shortid para crear IDs únicos

// ==============================================
// Definición del esquema de vacantes
// ==============================================
const vacantesSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: 'El nombre de la oferta es obligatorio',
    trim: true
  },
  empresa: {
    type: String,
    trim: true
  },
  ubicacion: {
    type: String,
    trim: true,
    required: 'La ubicación es obligatoria'
  },
  salario: {
    type: String,
    default: '0',
    trim: true
  },
  contrato: {
    type: String,
    trim: true
  },
  experiencia: {
    type: String,
    default: 0,
    trim: true
  },
    nivel: {
    type: String,
    default: 0,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    lowercase: true
  },
  skills: [String], // Array de habilidades requeridas
  candidatos: [{
    nombre: String,
    email: String,
    cv: String
  }]
});

// ==============================================
// Middleware para crear el slug y URL únicos
// ==============================================
vacantesSchema.pre('save', function(next) {
  // Crear el slug basado en el título
  const url = slug(this.titulo)
  this.url = `${slug(url)}-${shortid.generate()}`;
  next();
});

// ==============================================
// Exportar el modelo
// ==============================================
module.exports = mongoose.model('Vacante', vacantesSchema);
