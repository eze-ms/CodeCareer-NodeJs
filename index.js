// ==============================================
// Cargar las variables de entorno
// ==============================================
require('dotenv').config({ path: 'variables.env' });

// ==============================================
// Importar módulos necesarios
// ==============================================
const mongoose = require('mongoose'); // Mongoose para interactuar con MongoDB
const express = require('express'); // Express para crear el servidor
const exphbs = require('express-handlebars'); // Express-handlebars para configurar el motor de vistas
const path = require('path'); // Path para trabajar con rutas de archivos y directorios
const router = require('./routes'); // Archivo de rutas
const cookieParser = require('cookie-parser'); // Cookie-parser para manejar cookies
const session = require('express-session'); // Express-session para manejar sesiones
const MongoStore = require('connect-mongo'); // Connect-mongo para almacenar sesiones en MongoDB
const bodyParser = require('body-parser'); // Body parser para analizar cuerpos de solicitud entrantes en un middleware
const flash = require('connect-flash'); // Connect-flash para mensajes flash
require('./config/db'); // Conexión a la base de datos en el archivo principal

// ==============================================
// Crear una instancia de la aplicación express
// ==============================================
const app = express();

// ==============================================
// Habilitar body-parser
// ==============================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ==============================================
// Configurar el motor de vistas Handlebars
// ==============================================
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'layout', // Establecer un diseño predeterminado llamado 'layout'
  helpers: require('./helpers/handlebars') // Incluir helpers personalizados para Handlebars
}));
app.set('view engine', 'handlebars'); // Establecer handlebars como el motor de vistas

// ==============================================
// Configurar archivos estáticos
// ==============================================
app.use(express.static(path.join(__dirname, 'public'))); // Establecer la carpeta 'public' para archivos estáticos

// ==============================================
// Configurar middleware para manejar cookies y sesiones
// ==============================================
app.use(cookieParser());

app.use(session({
  secret: process.env.SECRETO, // Cadena secreta para firmar la sesión
  key: process.env.KEY, // Clave de la cookie de sesión
  resave: false, // No volver a guardar la sesión si no ha cambiado
  saveUninitialized: false, // No guardar sesiones no inicializadas
  store: MongoStore.create({ // Almacenar sesiones en MongoDB
    mongoUrl: process.env.DATABASE, // URL de la base de datos
    mongooseConnection: mongoose.connection // Conexión de mongoose
  })
}));

// ==============================================
// Alertas
// ==============================================
app.use(flash());

// ==============================================
// Crear nuestro middleware
// ==============================================
app.use((req, res, next) => {
  res.locals.mensajes = req.flash();
  next();
});

// ==============================================
// Usar el archivo de rutas para manejar las solicitudes a la raíz
// ==============================================
app.use('/', router());

// ==============================================
// Iniciar el servidor en el puerto de la variable de entorno
// ==============================================
const PORT = process.env.PUERTO || 3000; // Usar 3000 como puerto predeterminado si no se define PUERTO
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
