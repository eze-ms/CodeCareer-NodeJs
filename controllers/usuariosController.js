const { body, validationResult } = require('express-validator');
const Usuarios = require("../models/Usuarios");
const multer = require('multer');
const shortid = require('shortid');


// ==============================================
// Subir Imágenes al formulario
// ==============================================
exports.subirImagen = (req, res, next) => {
  upload(req, res, function(error) {
    if(error) {
      if(error instanceof multer.MulterError) {
          if(error.code === 'LIMIT_FILE_SIZE') {
              req.flash('error', 'El archivo es muy grande: Máximo 100kb ');
          } else {
              req.flash('error', error.message);
          }
      } else {
          req.flash('error', error.message);
      }
      res.redirect('/editar-perfil');
      return;
    } else {
        return next();
    }
  });
};

// ==============================================
// Opciones de Multer
// ==============================================
const configuracionMulter = {
    limits : { fileSize : 100000 },
    storage: fileStorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/perfiles');
        }, 
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato No Válido'));
        }
    }
};

// Crear el middleware de multer
const upload = multer(configuracionMulter).single('imagen');

// ==============================================
// Renderizar formulario de creación de cuenta
// ==============================================
exports.formCrearCuenta = (req, res) => {
  res.render('crear-cuenta', {
    nombrePagina: 'Crea tu cuenta en CodeCareer...',
    tagline: 'y comienza a publicar tus ofertas'
  });
};

// ==============================================
// Validar y sanitizar datos de registro
// ==============================================
exports.validarRegistro = [
  // Sanitizar campos
  body('nombre').escape(),
  body('email').escape(),
  body('password').escape(),
  body('confirmar').escape(),

  // Validar campos
  body('nombre', 'El nombre es obligatorio').notEmpty(),
  body('email', 'El email debe ser válido').isEmail(),
  body('password', 'La contraseña es obligatoria').notEmpty(),
  body('confirmar', 'Confirmar contraseña es obligatorio').notEmpty(),
  body('confirmar').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  }),

// ==============================================
// Manejo de errores de validación
// ==============================================
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      req.flash('error', errores.array().map(error => error.msg));
      return res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en CodeCareer',
        tagline: 'Comienza a publicar tus ofertas',
        mensajes: req.flash()
      });
    }
    next();
  }
];

// ==============================================
// Crear usuario y manejar posibles errores
// ==============================================
exports.crearUsuario = async (req, res, next) => {
  const usuario = new Usuarios(req.body);
  try {
    await usuario.save();
    res.redirect('/iniciar-sesion'); // Redirigir a la página de inicio de sesión
  } catch (error) {
    req.flash('error', error.message); // Almacenar el mensaje del error
    res.redirect('/crear-cuenta');
  }
};

// ==============================================
// Crear formulario para iniciar sesion
// ==============================================
exports.formIniciarSesion = async (req, res) => {
  res.render('iniciar-sesion', {
    nombrePagina: 'Iniciar Sesión CodeCareer'
  })
};

// ==============================================
// Crear formulario para editar perfil
// ==============================================
exports.formEditarPerfil = (req, res) => {
  res.render('editar-perfil', {
    nombrePagina: 'Edita tu perfil',
    usuario: req.user, // Asegúrate de pasar los datos del usuario autenticado
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen
  });
};

// ==============================================
// Guardar cambios en editar perfil
// ==============================================
exports.editarPerfil = async (req, res) => {
  const usuario = await Usuarios.findById(req.user._id);

  usuario.nombre = req.body.nombre;
  usuario.email = req.body.email;
  if (req.body.password) {
    usuario.password = req.body.password;
  }
  if(req.file){
    usuario.imagen = req.file.filename;
  }

  await usuario.save();

  req.flash('correcto', 'Cambios Guardados Correctamente');
  res.redirect('/administracion');
};

// ======================================================
// Validar y sanitizar los campos de editar perfil
// ======================================================
exports.validarPerfil = [
  // Sanitizar campos
  body('nombre').escape(),
  body('email').escape(),

  // Validar campos
  body('nombre', 'El nombre no puede ir vacío').notEmpty(),
  body('email', 'Introduzca un email válido').isEmail(),

  (req, res, next) => {
    // Validar y sanitizar la contraseña si está presente
    if (req.body.password) {
      body('password').escape()(req, res, () => {});
      body('password', 'La contraseña no puede ir vacía').notEmpty()(req, res, () => {});
    }

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      req.flash('error', errores.array().map(error => error.msg));

      return res.render('editar-perfil', { // Renderiza la vista de editar perfil
        nombrePagina: 'Editar Perfil',
        tagline: 'Modifica tu perfil',
        cargarShowMore: true,
        cargarBundle: true,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        mensajes: req.flash()
      });
    }

    next(); // todo bien, siguiente middleware!
  }
];
