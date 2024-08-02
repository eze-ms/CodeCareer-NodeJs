const Vacante = require('../models/Vacantes');

exports.formularioNuevaVacante = (req, res) => {
  res.render('nueva-vacante', {
    nombrePagina: 'Nueva oferta',
    tagline: 'Rellena el formulario y publica la nueva oferta de empleo',
  });
};

exports.agregarVacante = async (req, res) => {
  try {
    const vacante = new Vacante(req.body);
    vacante.skills = req.body.skills.split(',');

    await vacante.save();
    res.redirect(`/vacantes/${vacante.url}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al guardar la vacante');
  }
};

exports.mostrarVacante = async (req, res, next) => {
  try {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if (!vacante) return next();

    res.render('vacante', {
      vacante,
      nombrePagina: vacante.titulo,
      barra: true,
    });
  } catch (error) {
    console.error(error);
    return next();
  }
};

exports.formEditarVacante = async (req, res, next) => {
  try {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if (!vacante) return next();

    res.render('editar-vacante', {
      vacante,
      nombrePagina: `Editar - ${vacante.titulo}`,
    });
  } catch (error) {
    console.error(error);
    return next();
  }
};

exports.editarVacante = async (req, res) => {
  const vacanteActualizada = req.body;
  vacanteActualizada.skills = req.body.skills.split(',');

  const vacante = await Vacante.findOneAndUpdate(
    { url: req.params.url },
    vacanteActualizada,
    {
      new: true,
      runValidators: true,
    }
  );
  res.redirect(`/vacantes/${vacante.url}`);
};

// exports.mostrarTrabajos = async (req, res, next) => {
//   try {
//     const vacantes = await Vacante.find().lean();
//     res.render('home', {
//       nombrePagina: 'CodeCareer',
//       tagline: 'Portal especializado en empleos para desarrolladores y programadores',
//       barra: true,
//       boton: true,
//       vacantes,
//     });
//   } catch (error) {
//     console.error(error);
//     return next();
//   }
// };
