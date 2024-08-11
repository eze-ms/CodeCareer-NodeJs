const Vacante = require('../models/Vacantes');

exports.mostrarTrabajos = async (req, res, next) => {
  try {
    const vacantes = await Vacante.find().lean();  // Obtener todas las vacantes

    // Obtener todas las categorías distintas
    const categorias = await Vacante.distinct('categoria');

    if (!vacantes) return next();

    res.render('home', {
      // nombrePagina: 'CodeCareer',
      tagline: 'El portal especializado en empleos para desarrolladores y programadores',
      barra: true,
      boton: true,
      vacantes,
      categorias // Pasar las categorías a la vista
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al mostrar las vacantes');
  }
};
