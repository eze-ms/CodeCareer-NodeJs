const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const util = require('util');

// ! Configuración del transportador de nodemailer
let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.auth.user, // Acceder correctamente a user y pass
    pass: emailConfig.auth.pass
  }
});

// ! Configurar el uso de templates de Handlebars con nodemailer
transport.use('compile', hbs({
  // Configuración detallada del motor de plantillas (viewEngine)
  viewEngine: { 
    extName: '.handlebars', /* ! Extensión de los archivos de plantilla */
    partialsDir: path.resolve('./views/emails'), //* Directorio donde se encuentran los partials (fragmentos reutilizables de plantillas) */
    layoutsDir: path.resolve('./views/emails'),  //* Directorio donde se encuentran los layouts (estructuras generales de las plantillas) */
    defaultLayout: false, //*  No se utilizará un layout por defecto */
  },
  viewPath: path.resolve('./views/emails'), //* Directorio donde se encuentran las plantillas principales */
  extName: '.handlebars', //* Extensión de los archivos de plantilla como */
}));

exports.enviar = async (opciones) => {

    const opcionesEmail = {
        from:'devJobs <noreply@devjobs.com',
        to: opciones.usuario.email,
        subject : opciones.subject, 
        template: opciones.archivo,
        context: {
            resetUrl : opciones.resetUrl
        },
    };

  const senMail = util.promisify(transport.sendMail, transport);
  return senMail.call(transport, opcionesEmail);
}
