// ==============================================
//! Cargar las variables de entorno
// ==============================================
require('dotenv').config({ path: 'variables.env' });

// ==============================================
//! Conectar a la base de datos
// ==============================================
require('./config/db'); // Conexión a la base de datos en el archivo principal

// ==============================================
//! Importar módulos nativos
// ==============================================
const path = require('path'); // Path para trabajar con rutas de archivos y directorios

// ==============================================
//! Importar módulos de terceros
// ==============================================
const mongoose = require('mongoose'); //* Mongoose para interactuar con MongoDB
const express = require('express'); //* Express para crear el servidor
const exphbs = require('express-handlebars'); //* Express-handlebars para configurar el motor de vistas
const cookieParser = require('cookie-parser'); //* Cookie-parser para manejar cookies
const session = require('express-session'); //* Express-session para manejar sesiones
const MongoStore = require('connect-mongo'); //* Connect-mongo para almacenar sesiones en MongoDB
const bodyParser = require('body-parser'); //* Body parser para analizar cuerpos de solicitud entrantes en un middleware
const flash = require('connect-flash'); //* Connect-flash para mensajes flash
const createError = require('http-errors'); //* Importar el módulo http-errors para manejar errores en la aplicación

// ==============================================
//! Importar módulos propios
// ==============================================
const router = require('./routes'); // Archivo de rutas
const passport = require('./config/passport'); // Configuración de Passport para autenticación de usuarios
const { error } = require('console');

// ==============================================
//! Crear una instancia de la aplicación express
// ==============================================
const app = express();

// ==============================================
//! Habilitar body-parser para analizar cuerpos de solicitudes
// ==============================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==============================================
//! Configurar el motor de vistas Handlebars
// ==============================================
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'layout', // Establecer un diseño predeterminado llamado 'layout'
  helpers: require('./helpers/handlebars'), // Incluir helpers personalizados para Handlebars
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars'); // Establecer handlebars como el motor de vistas

// ==============================================
//! Configurar archivos estáticos
// ==============================================
app.use(express.static(path.join(__dirname, 'public'))); // Establecer la carpeta 'public' para archivos estáticos

// ==============================================
//! Configurar middleware para manejar cookies y sesiones
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
//! Inicializar Passport para la autenticación de usuarios
// ==============================================
app.use(passport.initialize());
app.use(passport.session());

// ==============================================
//! Habilitar mensajes flash para notificaciones
// ==============================================
app.use(flash());

// ==============================================
//! Crear nuestro middleware personalizado para manejo de mensajes y logs
// ==============================================
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  res.locals.mensajes = req.flash();
  next();
});

// ==============================================
//! Usar el archivo de rutas para manejar las solicitudes a la raíz
// ==============================================
app.use('/', router());

// ==============================================
//! 404
// ==============================================
app.use((req, res, next) => {
  next(createError(404, 'No Encontrado'))
})

// ==============================================
//! Admin de los errores
// ==============================================
app.use((error, req, res, next) => {
  res.locals.mensaje = error.message;
  const status = error.static || 500;
  res.locals.status = status;
  res.status(status);
  res.render('error');
})

// ==============================================
//! Configuración para que Heroku asigne puerta
// ==============================================
const host = '0.0.0.0';
const port = process.env.PORT;

app.listen(port, host, () => {
  console.log('El servidor está funcionado correctamente');
  
});

