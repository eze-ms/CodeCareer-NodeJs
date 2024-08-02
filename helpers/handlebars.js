module.exports = {
  obtenerColor: (categoria) => {
    const colores = {
      'Frontend': '#d4f6ed',
      'Backend': '#fce1cc',
      'FullStack': '#e3dbfa',
      'UI/UX': '#dff3fe',
      'DevOps': '#fbe2f4',
      'Cloud': '#eceff4',
      'Mobile': '#f0f0f0'
    };
    return colores[categoria] || '#ffffff';
  },
  seleccionarSkills: (seleccionadas = [], opciones) => {
    const skills = [
      // Frontend
      'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Next.js', 'Redux', 'Webpack', 'jQuery', 'Figma', 'Adobe XD', 

      // Backend
      'Node.js', 'Express.js', 'Django', 'Ruby on Rails', 'Laravel', 'Spring Boot', 'PHP', 'Python', 'Java', 'GraphQL', 'Nest.js', 
      'MongoDB', 'SQL', 'PostgreSQL', 'MySQL', 'Microsoft SQL Server',

      // FullStack
      // Combinación de Frontend y Backend ya listados

      // Mobile
      'Ionic', 'React Native', 'Kotlin', 'Swift', 'Objective-C',

      // DevOps
      'Docker', 'Kubernetes', 'Git', 'Azure DevOps', 'PowerShell',

      // Cloud
      'AWS', 'Azure', 'Google Cloud',

      // Testing (integrados en las categorías existentes)
      'Jest', 'Cypress', 'Selenium',

      // Microsoft (integrados en las categorías existentes)
      '.NET', 'ASP', 'ASP Core', 'C#', 'Visual Studio', 'Blazor', 'Xamarin', 'Microsoft Dynamics', 'Windows Server', 'Active Directory',
    ];

    let html = '';
    skills.forEach(skill => {
      html += `<li ${seleccionadas.includes(skill) ? 'class="activo"' : ''}>${skill}</li>`;
    });

    return new opciones.fn().html = html;
  },

  limit: (arr, limit) => {
    if (!Array.isArray(arr)) {
      return [];
    }
    return arr.slice(0, limit);
  },

  tipoContrato: (seleccionado, opciones) => {
    return opciones.fn(this).replace(
      new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
    );
  },

  mostrarAlertas: (errores = {}, alertas) => {
    const categorias = Object.keys(errores);
    let html = '';

    if (categorias.length) {
      categorias.forEach(categoria => {
        errores[categoria].forEach(error => {
          html += `<div class="${categoria} alerta">${error}</div>`;
        });
      });
    }
    return html;
  }
};
