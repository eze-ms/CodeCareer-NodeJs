
// ==============================================
//! Importar módulos necesarios
// ==============================================
import { accionesListado } from './alert';  // Importar la función

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    // ==============================================
    //* Limpiar las alertas si existen
    // ==============================================
    let alertas = document.querySelector('.alertas');
    if (alertas) {
        limpiarAlertas();
    }

    // ==============================================  
    //* Configuración de eventos para la lista de habilidades
    // ==============================================
    if (skills) {
        skills.addEventListener('click', agregarSkills);
        // Inicializar habilidades seleccionadas cuando se está en modo de edición
        skillsSeleccionados();
    }

    // ==============================================
    //* Configuración de eventos para el listado de vacantes
    // ==============================================
    const vacantesListado = document.querySelector('.panel-administracion');
    if (vacantesListado) {
        vacantesListado.addEventListener('click', accionesListado);
    }

    // ==============================================
    //* Filtrado de vacantes por categoría
    // ==============================================
    const categoriaSelect = document.querySelector('#categorias');
    if(categoriaSelect) {
        categoriaSelect.addEventListener('change', () => {
            // Enviar el formulario automáticamente cuando se selecciona una categoría
            document.getElementById('form-filtro').submit();
        });
    }

});

// ==============================================
//! Conjunto para almacenar las habilidades seleccionadas
// ==============================================
const selectedSkills = new Set();

// ==============================================
//! Función: Agregar o quitar habilidades al conjunto
// ==============================================
const agregarSkills = e => {
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) {
            // Quitar del conjunto y remover la clase
            selectedSkills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        } else {
            // Agregar al conjunto y añadir la clase
            selectedSkills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }

    // Actualizar el valor del input oculto con las habilidades seleccionadas
    const skillsArray = [...selectedSkills];
    const skillsInput = document.querySelector('#skills');
    if (skillsInput) {
        skillsInput.value = skillsArray.join(',');
    }
};

// ==============================================
//! Función: Inicializar el conjunto de habilidades seleccionadas
// ==============================================
const skillsSeleccionados = () => {
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    seleccionadas.forEach(seleccionada => {
        selectedSkills.add(seleccionada.textContent);
    });

    // Actualizar el valor del input oculto con las habilidades seleccionadas
    const skillsArray = [...selectedSkills];
    const skillsInput = document.querySelector('#skills');
    if (skillsInput) {
        skillsInput.value = skillsArray.join(',');
    }
};

// ==============================================
//! Función: Limpiar todas las alertas del DOM periódicamente
// ==============================================
const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas');
    if (!alertas) return; // Si no hay alertas, salir de la función inmediatamente

    const interval = setInterval(() => {
        if (alertas && alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        } else if (alertas && alertas.children.length === 0) {
            if (alertas.parentElement) {
                alertas.parentElement.removeChild(alertas);
            }
            clearInterval(interval);
        }
    }, 2000);
};
