document.addEventListener('DOMContentLoaded', () => {
  const skills = document.querySelector('.lista-conocimientos');

  if (skills) {
    skills.addEventListener('click', agregarSkills);
  }
});

const selectedSkills = new Set();

const agregarSkills = e => {
  if (e.target.tagName === 'LI') {
    if (e.target.classList.contains('activo')) {
      // quitarlo del set y la clase
      selectedSkills.delete(e.target.textContent);
      e.target.classList.remove('activo');
    } else {
      // agregarlo al set y agregar la clase
      selectedSkills.add(e.target.textContent);
      e.target.classList.add('activo');
    }
  }

  // Convertir el Set a un Array y luego a una cadena
  const skillsArray = [...selectedSkills];
  document.querySelector('#skills').value = skillsArray.join(',');
};
