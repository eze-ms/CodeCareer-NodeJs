// controllers/homeController.js
const Vacante = require('../models/Vacantes');

exports.mostrarTrabajos = async (req, res, next) => {
  try {
    const vacantes = await Vacante.find().lean();

    if (!vacantes) return next();

    res.render('home', {
      // nombrePagina: 'CodeCareer',
      tagline: 'El portal especializado en empleos para desarrolladores y programadores',
      barra: true,
      boton: true,
      vacantes
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al mostrar las vacantes');
  }
};
