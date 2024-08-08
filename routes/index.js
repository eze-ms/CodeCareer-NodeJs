// ==============================================
// Importar módulos necesarios
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
  // Ruta para Mostrar Ofertas en la Página Principal
  // ==============================================
  router.get('/', homeController.mostrarTrabajos);

  // ==============================================
  // Rutas para el Formulario de Creación de Nuevas Vacantes
  // ==============================================
  router.get('/vacantes/nueva', 
    authController.verificarUsuario, // Verificar si el usuario está autenticado
    vacantesController.formularioNuevaVacante // Mostrar el formulario para crear una nueva vacante
  );
  router.post('/vacantes/nueva', 
    authController.verificarUsuario, // Verificar si el usuario está autenticado
    vacantesController.validarVacante, // Validar y sanitizar los campos de las nuevas vacantes
    vacantesController.agregarVacante // Agregar una nueva vacante a la base de datos
  );

  // ==============================================
  // Ruta para Mostrar una vacante específica
  // ==============================================
  router.get('/vacantes/:url', vacantesController.mostrarVacante);

  // ==============================================
  // Rutas para Editar Vacantes
  // ==============================================
  router.get('/vacantes/editar/:url', 
    authController.verificarUsuario, // Verificar si el usuario está autenticado
    vacantesController.formEditarVacante // Mostrar el formulario para editar una vacante
  );
  router.post('/vacantes/editar/:url',
    authController.verificarUsuario, // Verificar si el usuario está autenticado
    vacantesController.validarVacante, // Validar y sanitizar los campos de las nuevas vacantes
    vacantesController.editarVacante // Editar una vacante existente en la base de datos
  );

  // ==============================================
  // Rutas para Eliminar Oferta
  // ==============================================
  router.delete('/vacantes/eliminar/:id',
    authController.verificarUsuario,
    vacantesController.eliminarVacante
  );

  // ==============================================
  // Rutas para Crear Cuenta de Usuario
  // ==============================================
  router.get('/crear-cuenta', usuariosController.formCrearCuenta); // Mostrar el formulario para crear una cuenta
  router.post('/crear-cuenta', 
    usuariosController.validarRegistro, // Validar los datos del registro
    usuariosController.crearUsuario // Crear un nuevo usuario en la base de datos
  );

  // ==============================================
  // Rutas para Autenticar usuarios
  // ==============================================
  router.get('/iniciar-sesion', usuariosController.formIniciarSesion); // Mostrar el formulario de inicio de sesión
  router.post('/iniciar-sesion', authController.autenticarUsuario); // Autenticar al usuario

  // ==============================================
  // Rutas para Cerrar Sesión
  // ==============================================
  router.get('/cerrar-sesion', 
    authController.verificarUsuario,
    authController.cerrarSesion
  );

  // ==============================================
  // Ruta para el Panel de Administración
  // ==============================================
  router.get('/administracion', 
    authController.verificarUsuario, // Verificar si el usuario está autenticado
    authController.mostrarPanel // Mostrar el panel de administración
  );

  // ==============================================
  // Ruta para Editar Perfil
  // ==============================================
  router.get('/editar-perfil', 
    authController.verificarUsuario,
    usuariosController.formEditarPerfil
  );
  router.post('/editar-perfil',
    authController.verificarUsuario,
    // usuariosController.validarPerfil,
    usuariosController.subirImagen,
    usuariosController.editarPerfil
  );

  return router; // Exportar el enrutador para usarlo en la aplicación principal
};
