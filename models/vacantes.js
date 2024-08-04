const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

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
  descripcion: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    lowercase: true
  },
  skills: [String],
  candidatos: [{
    nombre: String,
    email: String,
    cv: String
  }],
  categoria: {
    type: String,
    trim: true
  },
  experiencia: {
    type: String,
    default: 0,
    trim: true
  },
  nivel: {  // Añadido el campo nivel
    type: String,
    trim: true
  },
  autor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Usuarios',
    required: 'El autor es obligatorio'
  }
});

vacantesSchema.pre('save', function(next) {
  const url = slug(this.titulo);
  this.url = `${slug(url)}-${shortid.generate()}`;
  next();
});

module.exports = mongoose.model('Vacante', vacantesSchema);
