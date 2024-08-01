// controllers/vacantesController.js
const Vacante = require('../models/Vacantes');

exports.formularioNuevaVacante = (req, res) => {
  res.render('nueva-vacante', {
    nombrePagina: 'Nueva oferta',
    tagline: 'Rellena el formulario y publica la nueva oferta de empleo'
  });
};

// Agregar las vacantes a la BBDD
exports.agregarVacante = async (req, res) => {
  try {
    const vacante = new Vacante(req.body);

    // Crear array de habilidades
    vacante.skills = req.body.skills.split(',');

    // Almacenar en la BBDD
    const nuevaVacante = await vacante.save();

    // Redireccionar
    res.redirect(`/vacantes/${nuevaVacante.url}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al guardar la vacante');
  }
};

// Mostrar vacante
exports.mostrarVacante = async (req, res, next) => {
  try {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if (!vacante) return next();

    res.render('vacante', {
      vacante,
      nombrePagina: vacante.titulo,
      barra: true
    });
  } catch (error) {
    console.error(error);
    return next();
  }
};
