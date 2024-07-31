module.exports = {
  seleccionarSkills: (seleccionadas = [], opciones) => {
    const skills = [
      // Frontend
      'HTML5',
      'CSS3',
      'JavaScript',
      'React',
      'Angular',
      'Vue.js',
      'Bootstrap',
      'Tailwind CSS',
      'jQuery',
      'TypeScript',
      'Next.js',
      'Redux',
      'Webpack',

      // Backend
      'Node.js',
      'Express.js',
      'Django',
      'Ruby on Rails',
      'Laravel',
      'Spring Boot',
      'PHP',
      'Python',
      'Java',
      'GraphQL',
      'Nest.js',

      // Databases
      'MongoDB',
      'SQL',
      'PostgreSQL',
      'MySQL',

      // DevOps
      'Docker',
      'Kubernetes',
      'AWS',
      'Azure',
      'Google Cloud',
      'Git',

      // Testing
      'Jest',
      'Cypress',
      'Selenium',

      // Design Tools
      'Figma',
      'Adobe XD',

      // CMS
      'WordPress'
    ];

    let html = '';
    skills.forEach(skill => {
      html += `
        <li>${skill}</li>
      `;
    });

    return new opciones.fn().html = html;
  }
};
