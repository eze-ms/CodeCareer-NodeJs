// ==============================================
// Importar módulos necesarios
// ==============================================
const mongoose = require('mongoose'); //Módulo mongoose para interactuar con MongoDB
require('dotenv').config({ path: 'variables.env' }); // Cargar las variables de entorno desde el archivo 'variables.env'

// ==============================================
// Conectar a la BBDD
// ==============================================
// Conectar a la base de datos usando la URL de conexión almacenada en la variable de entorno 'DATABASE'
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });

// Manejar errores de conexión
// Escuchar el evento 'error' en la conexión de mongoose y registrar cualquier error que ocurra
mongoose.connection.on('error', (error) => {
  console.log('Error connecting to MongoDB:', error); // Imprimir el error en la consola
});

// ==============================================
// Importar modelos
// ==============================================
require('../models/vacantes'); // Modelo de vacantes
