const { body, validationResult } = require('express-validator');
const Vacante = require('../models/Vacantes');
const multer = require('multer');
const shortid = require('shortid');
const { cerrarSesion } = require('./authController');

// ==============================================
//! Renderizar el formulario para crear una nueva vacante
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
//! Agregar una nueva vacante a la base de datos
// ==============================================
exports.agregarVacante = async (req, res) => {
  try {
    // Crear una nueva instancia del modelo Vacante con los datos del formulario
    const vacante = new Vacante(req.body);

    // Usuario autor de la vacante
    vacante.autor = req.user._id;

    // Dividir las habilidades en un array
    vacante.skills = req.body.skills.split(',');

    // vacante.categoria = encodeURIComponent(req.body.categoria); //* Codificar categoría

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
//! Mostrar una vacante específica
// ==============================================
exports.mostrarVacante = async (req, res, next) => {
  try {
    // Buscar la vacante por URL en la base de datos y convertir el resultado a un objeto plano
    const vacante = await Vacante.findOne({ url: req.params.url }).populate('autor');
    
    // Si la vacante no se encuentra, pasar al siguiente middleware
    if (!vacante) return next();

    // Si la vacante se encuentra, renderizar la vista 'vacante' con los datos de la vacante
    res.render('vacante', {
      vacante, // Datos de la vacante
      nombrePagina: vacante.titulo, //* Título de la página es el título de la vacante
      barra: true,
    });
  } catch (error) {
    // En caso de error, registrar el error en la consola y pasar al siguiente middleware de error
    console.error(error);
    return next();
  }
};

// ==============================================
//! Filtrar vacantes por categoría
// ==============================================
exports.filtrarPorCategoria = async (req, res) => {
    try {
        const categoriaSeleccionada = req.body.categoria;

        const query = categoriaSeleccionada === 'Todas' ? {} : { categoria: categoriaSeleccionada };
        const vacantes = await Vacante.find(query).lean();
        const categorias = await Vacante.distinct('categoria');

        res.render('home', {
            nombrePagina: 'Vacantes filtradas',
            categorias, 
            vacantes,
            categoriaSeleccionada,
            cerrarSesion: true,
            nombre: req.user ? req.user.nombre : null,
            imagen: req.user ? req.user.imagen : null
        });
    } catch (error) {
        console.error('Error al filtrar las vacantes:', error);
        req.flash('error', 'Hubo un error al filtrar las vacantes');
        res.redirect('back');
    }
};

// ==============================================
//! Renderizar el formulario para editar una vacante
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
      nombre: req.user.nombre,
      imagen: req.user.imagen
    });
  } catch (error) {
    console.error(error);
    return next();
  }
};

// ==============================================
//! Editar una vacante existente en la base de datos
// ==============================================
exports.editarVacante = async (req, res) => {
  const vacanteActualizada = req.body;
  vacanteActualizada.skills = req.body.skills.split(',');
  vacanteActualizada.categoria = encodeURIComponent(req.body.categoria); //* Codificar categoría

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
//! Validar y sanitizar los campos de las nuevas vacantes
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
//! Eliminar una oferta de la base de datos
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
// ==============================================
//! Verifica el autor
// ==============================================
const verificarAutor = (vacante = {}, usuario = {}) => {
  if (!vacante.autor.equals(usuario._id)) {
    return false;
  }
  return true;
};

// ============================================== 
//! Subir archivos en PDF
// ==============================================
exports.subirCV  =  (req, res, next) => {
    upload(req, res, function(error) {
      if(error) {
        if(error instanceof multer.MulterError) {
          if(error.code === 'LIMIT_FILE_SIZE') {
              req.flash('error', 'El archivo es muy grande: Máximo 500kb');
          } else {
              req.flash('error', error.message);
          }
        } else {
            req.flash('error', error.message);
        }
        res.redirect('back');
        return;
      } else {
          return next();
      }
    });
}

// ==============================================
//! Opciones de Multer
// ==============================================
const configuracionMulter = {
    limits : { fileSize : 500000 },
    storage: fileStorage = multer.diskStorage({
      destination : (req, file, cb) => {
          cb(null, __dirname+'../../public/uploads/cv');
      },
      filename : (req, file, cb) => {
          const extension = file.mimetype.split('/')[1];
          cb(null, `${shortid.generate()}.${extension}`);
      }
    }),
    fileFilter(req, file, cb) {
      if(file.mimetype === 'application/pdf' ) {
          // el callback se ejecuta como true o false : true cuando la imagen se acepta
          cb(null, true);
      } else {
          cb(new Error('Formato No Válido'));
      }
    }
}

//! Crear el middleware de multer
const upload = multer(configuracionMulter).single('cv');

// ==============================================
//! Almacenar los candidatos en la base de datos
// ==============================================
exports.contactar = async (req, res, next) => {
  try {
    const vacante = await Vacante.findOne({ url: req.params.url });

    // Si no existe la vacante
    if (!vacante) {
      req.flash('error', 'La vacante no existe');
      return res.redirect('/');
    }

    // Validar que los datos necesarios están presentes
    const { nombre, email } = req.body;
    if (!nombre || !email || !req.file) {
      req.flash('error', 'Todos los campos son obligatorios');
      return res.redirect('back');
    }

    // Construir el nuevo objeto candidato
    const nuevoCandidato = {
      nombre,
      email,
      cv: req.file.filename
    };

    // Almacenar el candidato en la vacante
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    // Mensaje Flash y redirección
    req.flash('correcto', 'Se ha enviado tu currículum correctamente');
    res.redirect('/');
  } catch (error) {
    console.error('Error al contactar al reclutador:', error);
    req.flash('error', 'Hubo un error al enviar tu currículum. Inténtalo de nuevo.');
    res.redirect('back');
  }
};

// ==============================================
//! Candidatos
// ==============================================
exports.mostrarCandidatos = async (req, res, next) => {
  try {
    const vacante = await Vacante.findById(req.params.id).lean();

    if (!vacante) {
      return res.status(404).send('Vacante no encontrada');
    }

    if (!vacante.autor.equals(req.user._id)) {
      return res.status(403).send('No tienes permiso para ver los candidatos de esta vacante');
    }

    res.render('candidatos', {
      nombrePagina: `Candidatos - ${vacante.titulo}`,
      cerrarSesion: true,
      nombre: req.user.nombre,
      imagen: req.user.imagen,
      candidatos: vacante.candidatos
    });
  } catch (error) {
    console.error('Error al mostrar los candidatos:', error);
    return next(error);
  }
};

// ==============================================
//! Buscador de vacantes
// ==============================================
exports.buscarVacantes = async (req, res) => {
    const vacantes = await Vacante.find({
        $text : {
            $search : req.body.q
        }
    });

    // mostrar las vacantes
    res.render('home', {
        nombrePagina : `Resultados para la búsqueda : ${req.body.q}`, 
        barra: true,
        vacantes 
    })
}