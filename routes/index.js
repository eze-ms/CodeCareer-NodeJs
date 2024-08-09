// ==============================================
//! Importar módulos necesarios
// ==============================================
const express = require('express'); // Importar el módulo express
const router = express.Router(); // Crear un enrutador de Express
const homeController = require('../controllers/homeController'); // Importar el controlador de la página principal
const vacantesController = require('../controllers/vacantesController'); // Importar el controlador de vacantes
const usuariosController = require('../controllers/usuariosController'); // Importar el controlador de usuarios
const authController = require('../controllers/authController'); // Importar el controlador de autenticación

// ==============================================
// Definir rutas
// ==============================================
module.exports = () => {

  // ==============================================
  //! Ruta para Mostrar Ofertas en la Página Principal
  // ==============================================
  router.get('/', 
    homeController.mostrarTrabajos);

  // ==============================================
  //! Rutas para el Formulario de Creación de Nuevas Vacantes
  // ==============================================
  router.get('/vacantes/nueva', 
    authController.verificarUsuario, //* Verificar si el usuario está autenticado
    vacantesController.formularioNuevaVacante //* Mostrar el formulario para crear una nueva vacante
  );
  router.post('/vacantes/nueva', 
    authController.verificarUsuario, //* Verificar si el usuario está autenticado
    vacantesController.validarVacante, //* Validar y sanitizar los campos de las nuevas vacantes
    vacantesController.agregarVacante //* Agregar una nueva vacante a la base de datos
  );

  // ==============================================
  //! Ruta para Mostrar una vacante específica
  // ==============================================
  router.get('/vacantes/:url', vacantesController.mostrarVacante);

  // ==============================================
  //! Rutas para Editar Vacantes
  // ==============================================
  router.get('/vacantes/editar/:url', 
    authController.verificarUsuario, //* Verificar si el usuario está autenticado
    vacantesController.formEditarVacante //* Mostrar el formulario para editar una vacante
  );
  router.post('/vacantes/editar/:url',
    authController.verificarUsuario, //* Verificar si el usuario está autenticado
    vacantesController.validarVacante, //* Validar y sanitizar los campos de las nuevas vacantes
    vacantesController.editarVacante //* Editar una vacante existente en la base de datos
  );

  // ==============================================
  //! Rutas para Eliminar Oferta
  // ==============================================
  router.delete('/vacantes/eliminar/:id',
    authController.verificarUsuario, //* Verificar si el usuario está autenticado
    vacantesController.eliminarVacante //* Eliminar una vacante específica
  );

  // ==============================================
  //! Rutas para Crear Cuenta de Usuario
  // ==============================================
  router.get('/crear-cuenta', usuariosController.formCrearCuenta); //* Mostrar el formulario para crear una cuenta
  router.post('/crear-cuenta', 
    usuariosController.validarRegistro, //* Validar los datos del registro
    usuariosController.crearUsuario //* Crear un nuevo usuario en la base de datos
  );

  // ==============================================
  //! Rutas para Autenticar usuarios
  // ==============================================
  router.get('/iniciar-sesion', usuariosController.formIniciarSesion); //* Mostrar el formulario de inicio de sesión
  router.post('/iniciar-sesion', authController.autenticarUsuario); //* Autenticar al usuario

  // ==============================================
  //! Rutas para Cerrar Sesión
  // ==============================================
  router.get('/cerrar-sesion', 
    authController.verificarUsuario, //* Verificar si el usuario está autenticado
    authController.cerrarSesion //* Cerrar la sesión del usuario
  );

   // ==============================================
  //! Rutas para Resetear Password (emails)
  // ==============================================
  router.get('/reestablecer-password', authController.formReestablecerPassword); //* Mostrar el formulario para reestablecer la contraseña
  router.post('/reestablecer-password', authController.enviarToken); //* Enviar el token para reestablecer la contraseña
  
  // ==============================================
  //! Rutas para Resetear Password (BBDD)
  // ==============================================
  router.get('/reestablecer-password/:token', authController.reestablecerPassword); // * Mostrar el formulario para ingresar una nueva contraseña, utilizando el token enviado por email
  router.post('/reestablecer-password/:token', authController.guardarPassword); // * Almacenar la nueva contraseña en la base de datos, validando el token

  // ==============================================
  //! Ruta para el Panel de Administración
  // ==============================================
  router.get('/administracion', 
    authController.verificarUsuario, //* Verificar si el usuario está autenticado
    authController.mostrarPanel //* Mostrar el panel de administración
  );

  // ==============================================
  //! Ruta para Editar Perfil
  // ==============================================
  router.get('/editar-perfil', 
    authController.verificarUsuario, //* Verificar si el usuario está autenticado
    usuariosController.formEditarPerfil //* Mostrar el formulario para editar el perfil
  );
  router.post('/editar-perfil',
    authController.verificarUsuario, //* Verificar si el usuario está autenticado
    // usuariosController.validarPerfil,
    usuariosController.subirImagen, //* Subir una nueva imagen de perfil
    usuariosController.editarPerfil //* Editar el perfil del usuario
  );

    // ==============================================
  //! Ruta para Recibir mensajes
  // ==============================================
  router.post('/vacantes/:url', 
    vacantesController.subirCV, //* Subir el currículum vitae
    vacantesController.contactar //* Contactar con la empresa
  );

  // ==============================================
  //! Ruta Mostrar los candidatos por vacante
  // ==============================================
  router.get('/candidatos/:id',
    authController.verificarUsuario, //* Verificar si el usuario está autenticado
    vacantesController.mostrarCandidatos //* Mostrar los candidatos que aplicaron a una vacante
  )

  // ==============================================
  //! Buscador de vacantes
  // ==============================================
  router.post('/buscador', vacantesController.buscarVacantes);

  return router;
};
