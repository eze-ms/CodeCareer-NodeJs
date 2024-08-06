const { body, validationResult } = require('express-validator');
const { errorMonitor } = require('connect-mongo');
const Vacante = require('../models/Vacantes');

// ==============================================
// Renderizar el formulario para crear una nueva vacante
// ==============================================
exports.formularioNuevaVacante = (req, res) => {
  res.render('nueva-vacante', {
    nombrePagina: 'Nueva oferta',
    tagline: 'Rellena el formulario y publica la nueva oferta de empleo',
    cargarShowMore: true, // Esto asegura que se cargue showMore.js
    cargarBundle: true, // Esto asegura que se cargue bundle.js
    cerrarSesion: true,
    nombre: req.user.nombre
  });
};

// ==============================================
// Agregar una nueva vacante a la base de datos
// ==============================================
exports.agregarVacante = async (req, res) => {
  try {
    // Crear una nueva instancia del modelo Vacante con los datos del formulario
    const vacante = new Vacante(req.body);

    // Usuario autor de la vacante
    vacante.autor = req.user._id;

    // Dividir las habilidades en un array
    vacante.skills = req.body.skills.split(',');

    // Guardar la nueva vacante en la base de datos
    await vacante.save();

    // Redireccionar a la página de la vacante recién creada
    res.redirect(`/vacantes/${vacante.url}`);
  } catch (error) {
    // En caso de error, registrar el error en la consola y enviar una respuesta de error
    console.error(error);
    res.status(500).send('Error al guardar la vacante');
  }
};

// ==============================================
// Mostrar una vacante específica
// ==============================================
exports.mostrarVacante = async (req, res, next) => {
  try {
    // Buscar la vacante por URL en la base de datos y convertir el resultado a un objeto plano
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    // Si la vacante no se encuentra, pasar al siguiente middleware
    if (!vacante) return next();

    // Si la vacante se encuentra, renderizar la vista 'vacante' con los datos de la vacante
    res.render('vacante', {
      vacante, // Datos de la vacante
      nombrePagina: vacante.titulo, // Título de la página es el título de la vacante
      barra: true, // Indica que se debe mostrar una barra en la vista (esto depende de la implementación de la vista)
    });
  } catch (error) {
    // En caso de error, registrar el error en la consola y pasar al siguiente middleware de error
    console.error(error);
    return next();
  }
};

// ==============================================
// Renderizar el formulario para editar una vacante
// ==============================================
exports.formEditarVacante = async (req, res, next) => {
  try {
    // Buscar la vacante por URL en la base de datos y convertir el resultado a un objeto plano
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    // Si la vacante no se encuentra, pasar al siguiente middleware
    if (!vacante) return next();

    // Si la vacante se encuentra, renderizar la vista 'editar-vacante' con los datos de la vacante
    res.render('editar-vacante', {
      vacante, // Datos de la vacante
      nombrePagina: `Editar - ${vacante.titulo}`, // Título de la página
      cargarShowMore: true, // Esto asegura que se cargue showMore.js
      cargarBundle: true, // Esto asegura que se cargue bundle.js
      cerrarSesion: true,
      nombre: req.user.nombre
    });
  } catch (error) {
    // En caso de error, registrar el error en la consola y pasar al siguiente middleware de error
    console.error(error);
    return next();
  }
};

// ==============================================
// Editar una vacante existente en la base de datos
// ==============================================
exports.editarVacante = async (req, res) => {
  // Actualizar los datos de la vacante con los datos del formulario
  const vacanteActualizada = req.body;
  vacanteActualizada.skills = req.body.skills.split(',');

  // Encontrar la vacante por URL y actualizarla con los nuevos datos
  const vacante = await Vacante.findOneAndUpdate(
    { url: req.params.url },
    vacanteActualizada,
    {
      new: true, // Devolver el documento actualizado en lugar del original
      runValidators: true, // Ejecutar validadores de modelo en las actualizaciones
    }
  );

  // Redireccionar a la página de la vacante actualizada
  res.redirect(`/vacantes/${vacante.url}`);
};

// ======================================================
// Validar y sanitizar los campos de las nuevas vacantes
// ======================================================
exports.validarVacantes = [
  // Sanitizar campos
  body('titulo').escape(),
  body('empresa').escape(),
  body('ubicacion').escape(),
  body('salario').escape(),
  body('contrato').escape(),
  body('categoria').escape(),
  body('experiencia').escape(),
  body('nivel').escape(),

  // Validar campos
  body('titulo', 'Agrega un título a la oferta').notEmpty(),
  body('empresa', 'Agrega el nombre de una empresa').notEmpty(),
  body('ubicacion', 'Agrega una ubicacion').notEmpty(),
  body('contrato', 'Selecciona el tipo de contrato').notEmpty(),
  body('categoria', 'Agrega al menos una categoria').notEmpty(),
  body('nivel', 'Agrega al menos un nivel de experiencia').notEmpty(),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      req.flash('error', errores.array().map(error => error.msg));

      return res.render('nueva-vacante', {
        nombrePagina: 'Nueva oferta',
        tagline: 'Rellena el formulario y publica la nueva oferta de empleo',
        cargarShowMore: true,
        cargarBundle: true,
        cerrarSesion: true,
        nombre: req.user.nombre,
        mensajes: req.flash()
      });
    }

    next();
  }
];
