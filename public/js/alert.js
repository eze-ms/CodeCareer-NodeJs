// ==============================================
// Importar módulos necesarios
// ==============================================
import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener('DOMContentLoaded', () => {
    // ==============================================
    // Configuración de eventos para el listado de vacantes
    // ==============================================
    const vacantesListado = document.querySelector('.panel-administracion');
    if (vacantesListado) {
        vacantesListado.addEventListener('click', accionesListado);
    }
});

// ==============================================
// Función para manejar eliminar en la lista de ofertas
// ==============================================
const accionesListado = e => {
    e.preventDefault();
    console.log('Elemento clicado:', e.target);

    if (e.target.dataset.eliminar) {
        console.log('ID para eliminar:', e.target.dataset.eliminar); // Añadir un log para verificar el ID
        Swal.fire({
            title: "Confirmar Eliminar?",
            text: "Una vez eliminada, no se podrá recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
                console.log('URL para eliminar:', url);

                axios.delete(url)
                    .then(function(respuesta) {
                        console.log('Respuesta del servidor:', respuesta);
                        if (respuesta.status === 200) {
                            Swal.fire(
                                'Eliminado',
                                respuesta.data,
                                'success'
                            );
                            const vacanteElemento = e.target.closest('.vacante_admin');
                            if (vacanteElemento) {
                                vacanteElemento.remove();
                            }

                            // Verificar si hay más vacantes en el DOM
                            const vacantesRestantes = document.querySelectorAll('.vacante_admin');
                            if (vacantesRestantes.length === 0) {
                                const panelAdministracion = document.querySelector('.panel-administracion');
                                if (panelAdministracion) {
                                    panelAdministracion.innerHTML = '<p>No hay ofertas, puedes crear una</p>';
                                }
                            }
                        }
                    })
                    .catch((error) => {
                        console.error('Error al eliminar:', error);
                        Swal.fire({
                            icon: "error",
                            title: "Hubo un error",
                            text: "No se pudo eliminar"
                        });
                    });
            }
        });
    } else if (e.target.tagName === 'A') {
        window.location.href = e.target.href;
    }
};
