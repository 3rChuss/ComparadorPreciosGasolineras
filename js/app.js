const ui = new UI();


// Declaraciones
const formulario = document.querySelector('#formulario');
const divFiltros = document.querySelector('#divFiltros');
const resultadoDiv = document.querySelector('.resultado');
const contenedorBotones = document.querySelector('#contenedorBtnsSimple');
const contenedorBtnFiltro = document.querySelector('#contenedorBtnFiltro');
const btnFiltro = document.getElementById('btnFiltros');
const btnBuscar = document.querySelector('#btnBuscar');
const inputMunicipio = document.querySelector('#municipio');
const btnUbicacion = document.querySelector('#btnMyLocate');
let gasolineras;



// Listeners

// Escuchamos si el cliente quiere obtener su ubicacion para mostrar las gasolineras alli
btnUbicacion.addEventListener('click', (e) => {
     e.preventDefault();
     ui.obtenerUbicacion();
})

// Creamos un toggle de filtros para desplegar y ocultar los filtros
btnFiltro.addEventListener('click', () => {

     //mostramos y/o ocultamos el div y el boton buscar lo desplazamos a la parte de abajo del formulario
     if (divFiltros.classList.contains('d-none')) {

          resultadoDiv.classList.remove('d-block');
          resultadoDiv.classList.add('d-none');

          divFiltros.classList.remove('d-none');
          divFiltros.classList.add('d-flex');

          contenedorBotones.removeChild(btnBuscar);
          setTimeout(() => {
               divFiltros.style.opacity = 1;
               resultadoDiv.style.opacity = 0;
          }, 100);
          btnBuscar.classList.remove('float-left');
          btnBuscar.classList.add('float-right');
          contenedorBtnFiltro.appendChild(btnBuscar);
          
     } else {

          contenedorBtnFiltro.removeChild(btnBuscar);
          btnBuscar.classList.add('float-left');
          btnBuscar.classList.remove('float-right');

          divFiltros.style.opacity = 0;
          resultadoDiv.style.opacity = 1;

          setTimeout(() => {
               divFiltros.classList.remove('d-flex');
               divFiltros.classList.add('d-none');
               contenedorBotones.appendChild(btnBuscar);
          }, 120);

          if ( resultadoDiv.lastElementChild !== null ) {
               setTimeout(() => {
                    resultadoDiv.classList.add('d-block'); 
               }, 150);
          }

     }

});

inputMunicipio.addEventListener('keydown', (e) => {
     if (e.keyCode == '13') buscar();
})

// Mostrar las gasolineras cuando hagamos submit el form
formulario.addEventListener('submit', (e) => {
     e.preventDefault();
     buscar()

})

function buscar(){
     let municipio;
     let radioCombustible = document.querySelectorAll('#radioCombustible');
     let combustible = '';
     let ordenPrecioSelect = '';
     let ordenPrecio = '';

     //Borramos los resultados si existen con anterioridad
     let child = resultadoDiv.lastElementChild;
     while (child) {
          resultadoDiv.removeChild(child);
          child = resultadoDiv.lastElementChild;
     }

     //Tenemos que controlar el filtro, comprobar los campos para formar la url antes de obtener los datos
     if (inputMunicipio.value.length > 3) {
          municipio = inputMunicipio.value;
     }
     //comprobamos si el DivFiltro esta visible, si es asi enviamos las opciones a nuestro mostrar gasolienras
     if (divFiltros.classList.contains('d-flex')) {
          radioCombustible.forEach(radio => {
               if (radio.checked) combustible = radio.value;
          });
          ordenPrecioSelect = document.querySelector('#ordenPrecio');
          ordenPrecio = ordenPrecioSelect.options[ordenPrecioSelect.selectedIndex].value;
     }

     // por ultimo llamamos mostrarGasolineras;
     ui.mostrarGasolineras(municipio, combustible, ordenPrecio);
     abrirPopup();  

}

function abrirPopup() {
     setTimeout(() => {
          gasolineras = document.querySelectorAll('.container-popup');
          gasolineras.forEach(item => {
               item.addEventListener('click', (e) => {
                    ui.abrirPopup(item.id)
               })
          })
     }, 200);
}

