const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const util = require('util');

// Configuración del transportador de nodemailer
let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.auth.user, // Acceder correctamente a user y pass
    pass: emailConfig.auth.pass
  }
});
