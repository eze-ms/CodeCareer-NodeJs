exports.mostrarTrabajos = (req, res) => {
  res.render('home', {
    nombrePagina: 'CodeCareer',
    tagline: 'Portal especializado en empleos para desarrolladores y programadores',
    barra: true,
    boton: true
  });
};
