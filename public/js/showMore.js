document.addEventListener('DOMContentLoaded', function () {
  const skillsList = document.querySelectorAll('.lista-conocimientos li');
  const showMoreBtn = document.getElementById('show-more-btn');

  // Ocultar todos los elementos excepto los primeros 20
  skillsList.forEach((skill, index) => {
    if (index >= 20) {
      skill.classList.add('hidden_show_more');
    }
  });

  // Mostrar todos los elementos ocultos cuando se hace clic en el botón
  showMoreBtn.addEventListener('click', function () {
    const hiddenSkills = document.querySelectorAll('.lista-conocimientos .hidden_show_more');
    hiddenSkills.forEach(skill => {
      skill.classList.remove('hidden_show_more');
    });
    showMoreBtn.style.display = 'none';
  });
});
