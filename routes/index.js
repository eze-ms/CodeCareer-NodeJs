// ==============================================
// Importar módulos necesarios
// ==============================================
const express = require('express'); // Importar el módulo express
const router = express.Router(); // Crear un enrutador de Express
const homeController = require('../controllers/homeController'); // Importar el controlador de la página principal
const vacantesController = require('../controllers/vacantesController'); // Importar el controlador de vacantes

// ==============================================
// Definir rutas
// ==============================================
module.exports = () => {
  // Ruta para mostrar trabajos en la página principal
  router.get('/', homeController.mostrarTrabajos);

  // Ruta para el formulario de creación de nuevas vacantes
  router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante);
  router.post('/vacantes/nueva', vacantesController.agregarVacante)
   // Mostrar vacante
  router.get('/vacantes/:url', vacantesController.mostrarVacante);
  return router; // Exportar el enrutador para usarlo en la aplicación principal
};
