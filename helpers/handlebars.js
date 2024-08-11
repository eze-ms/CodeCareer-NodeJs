const he = require('he');

module.exports = {
  obtenerColor: (categoria) => {
    console.log('Procesando categoría:', categoria);
    const colores = {
      'Frontend': '#d4f6ed',
      'Backend': '#fce1cc',
      'FullStack': '#e3dbfa',
      'ProductDesign': '#ffd1dc',  
      'DevOps': '#fbe2f4',
      'Cloud': '#eceff4',
      'Mobile': '#f0f0f0',
      'BigData': '#b4d1ff',         
      'DataScience': '#cce5ff',    
      'IoT': '#cfe2f3'         
    };

    return colores[categoria] || '#ffffff';
  },
  
  seleccionarSkills: (seleccionadas = [], opciones) => {
    const skills = {
    Frontend: [
      'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Angular', 
      'Vue.js', 'Next.js', 'Vuex', 'Redux', 'Webpack', 'jQuery', 'Responsive Design'
    ],
    Backend: [
      'Node.js', 'Express.js', 'Django', 'Ruby on Rails', 'Laravel', 
      'Spring Boot', 'PHP', 'Python', 'Java', 'GraphQL', 'Nest.js', 
      'MongoDB', 'SQL', 'PostgreSQL', 'MySQL', 'Microsoft SQL Server', 
      'RESTful APIs', 'Seguridad Backend', 'CI/CD'
    ],
    Mobile: [
      'Ionic', 'React Native', 'Kotlin', 'Swift', 'Objective-C', 
      'Flutter', 'Xamarin'
    ],
    DevOps: [
      'Docker', 'Kubernetes', 'Git', 'GitHub', 'Azure DevOps', 'PowerShell', 
      'Jenkins', 'Terraform', 'CI/CD'
    ],
    Cloud: [
      'AWS', 'Azure', 'Google Cloud', 'IBM Cloud', 'Oracle Cloud', 
      'Seguridad en la Nube', 'IaC'
    ],
    Testing: [
      'Jest', 'Cypress', 'Selenium', 'Mocha', 'Chai', 'Jasmine', 
      'Pruebas Unitarias', 'Pruebas de Integración'
    ],
    Microsoft: [
      '.NET', 'ASP.NET', 'C#', 'Visual Studio', 'Blazor', 'Xamarin', 
      'Azure', 'SQL Server', 'Azure DevOps'
    ],
    ProductDesign: [
      'Figma', 'Adobe XD', 'Sketch', 'InVision', 'Zeplin', 
      'Prototyping', 'Wireframing', 'UI Design', 'UX Design'
    ],
    IoT: [
      'AWS IoT', 'Azure IoT Hub', 'Google Cloud IoT', 'Raspberry Pi', 
      'Arduino', 'Node-RED', 'MQTT', 'CoAP', 'HTTP', 'Integración con Nube', 
      'Sensores y Actuadores'
    ]
  };

    let html = '';
    
    Object.keys(skills).forEach(categoria => {
        // Comienza un nuevo bloque para cada categoría
        html += `<div class="categoria-bloque ${categoria !== 'Frontend' && categoria !== 'Backend' ? 'hidden_category' : ''}">`;
        html += `<h3 class="categoria-titulo">${categoria}</h3>`;
        
        // Añade las habilidades de la categoría
        html += `<ul class="skills-lista">`;
        skills[categoria].forEach((skill, index) => {
            html += `<li ${seleccionadas.includes(skill) ? 'class="activo"' : ''} class="${index >= 25 && (categoria === 'Frontend' || categoria === 'Backend') ? 'hidden_show_more' : ''}">${skill}</li>`;
        });
        html += `</ul>`; // Cierra la lista de habilidades
        
        // Cierra el bloque de la categoría
        html += `</div>`;
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
  },

  eq: (a, b) => a === b
};
