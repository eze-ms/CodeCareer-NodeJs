// ==============================================
// Importar módulos necesarios
// ==============================================
const express = require('express'); // Importar el módulo express
const router = express.Router(); // Crear un enrutador de Express
const homeController = require('../controllers/homeController'); // Importar el controlador de la página principal
const vacantesController = require('../controllers/vacantesController'); // Importar el controlador de vacantes
const usuariosController = require('../controllers/usuariosController'); // Importar el controlador de usuarios

// ==============================================
// Definir rutas
// ==============================================

module.exports = () => {
  router.get('/', homeController.mostrarTrabajos);

  // Ruta para el formulario de creación de nuevas vacantes
  router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante);
  router.post('/vacantes/nueva', vacantesController.agregarVacante);

  // Ruta para mostrar una vacante
  router.get('/vacantes/:url', vacantesController.mostrarVacante);

  // Editar vacantes
  router.get('/vacantes/editar/:url', vacantesController.formEditarVacante);
  router.post('/vacantes/editar/:url', vacantesController.editarVacante);

  // Crear cuenta
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.validarRegistro, usuariosController.crearUsuario);

  return router;
};
