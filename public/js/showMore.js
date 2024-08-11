document.addEventListener('DOMContentLoaded', function () {
  const showMoreBtn = document.getElementById('show-more-btn');

  showMoreBtn.addEventListener('click', function () {
    // Oculta el botón de Ver más
    showMoreBtn.style.display = 'none';

    // Muestra todas las categorías y habilidades
    const categoriaBloques = document.querySelectorAll('.categoria-bloque');
    categoriaBloques.forEach(bloque => {
      const skillsList = bloque.querySelectorAll('li.hidden_show_more');
      skillsList.forEach(skill => {
        skill.classList.remove('hidden_show_more');
      });
      bloque.classList.remove('hidden_category');
    });
  });
});
