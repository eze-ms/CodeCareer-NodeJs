const { body, validationResult } = require('express-validator');
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
    nombre: req.user.nombre,
    imagen: req.user.imagen
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

    vacante.categoria = encodeURIComponent(req.body.categoria); // Codificar categoría

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
      cerrarSesion: true,
      nombre: req.user.nombre,
      // imagen: req.user.imagen,
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
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if (!vacante) return next();

    console.log('Vacante encontrada:', vacante);

    res.render('editar-vacante', {
      vacante,
      nombrePagina: `Editar - ${vacante.titulo}`,
      cargarShowMore: true,
      cargarBundle: true,
      cerrarSesion: true,
      barra: true,
      nombre: req.user.nombre,
      imagen: req.user.imagen
    });
  } catch (error) {
    console.error(error);
    return next();
  }
};

// ==============================================
// Editar una vacante existente en la base de datos
// ==============================================
exports.editarVacante = async (req, res) => {
  const vacanteActualizada = req.body;
  vacanteActualizada.skills = req.body.skills.split(',');
  vacanteActualizada.categoria = encodeURIComponent(req.body.categoria); // Codificar categoría

  try {
    const vacante = await Vacante.findOneAndUpdate(
      { url: req.params.url },
      vacanteActualizada,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vacante) {
      req.flash('error', 'Hubo un error al actualizar la vacante');
      return res.redirect('back');
    }

    req.flash('correcto', 'La vacante se ha actualizado correctamente');
    res.redirect(`/vacantes/${vacante.url}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Hubo un error al actualizar la vacante');
    res.redirect('back');
  }
};

// ======================================================
// Validar y sanitizar los campos de las nuevas vacantes
// ======================================================
exports.validarVacante = [
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

// ==============================================
// Eliminar una oferta de la base de datos
// ==============================================
exports.eliminarVacante = async (req, res) => {
  const { id } = req.params;

  try {
    const vacante = await Vacante.findById(id);

    if (verificarAutor(vacante, req.user)) {
      // Sí es el usuario, eliminar
      await Vacante.findByIdAndDelete(id);
      res.status(200).send('Vacante eliminada correctamente');
    } else {
      // No permitido
      res.status(403).send('Error: No tienes permiso para eliminar esta vacante');
    }
  } catch (error) {
    console.error('Error al eliminar la vacante:', error);
    res.status(500).send('Hubo un error al eliminar la vacante');
  }
};

const verificarAutor = (vacante = {}, usuario = {}) => {
  if (!vacante.autor.equals(usuario._id)) {
    return false;
  }
  return true;
};
