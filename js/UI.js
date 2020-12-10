class UI {
     constructor() {
          // Instanciar la API
          this.api = new API();

          // Crear los markerscon layerGroup
          this.markers = new L.LayerGroup()

          // Instanciamos un array para almacenar los id de los markers
          this._popUp = new Array();

          // Iniciar el mapa
          this.mapa = this.inicializarMapa();

     }

     inicializarMapa() {
          // Inicializar y obtener la propiedad del mapa
          const map = L.map('mapa').setView([40.1265796, -4.8350279], 5.75);
          const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
          L.tileLayer(
               'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
               attribution: '&copy; ' + enlaceMapa + ' Contributors',
               maxZoom: 18,
               locate: {
                    watch: true,
                    setView: true
               }
          }).addTo(map);
          return map;
     }

     obtenerUbicacion() {
          if( navigator.geolocation ) {
               //navigator.geolocation.getCurrentPosition(p);
          }  
     }


     mostrarGasolineras(municipio, combustible = null, ordenPor = null){

          let url = `https://services3.arcgis.com/UlkXMDr5qa7NVX95/arcgis/rest/services/Gasolineras_de_Espa%C3%B1a/FeatureServer/0/query?where=municipio%20%3D%20%27${municipio.toUpperCase()} %27&outFields=*&outSR=4326&f=json`;

          

          //Cambio de url 10 de Dic 2020
          //`https://www.mapabase.es/arcgis/rest/services/Otros/Gasolineras/FeatureServer/0/query?where=municipio%20%3D%20%27${municipio.toUpperCase()}%27&outFields=*&outSR=4326&f=json`;


          this.api.obtenerDatos(url)
               .then( datos => {
                    const respuesta = datos.respuesta.features;
                    // Mostramos los pines segun la busqueda
                    this.mostrarPines(respuesta, { combustible, ordenPor });
               })
     }


     mostrarPines(datos, filtro) {
          // Limpiar antes de llamar
          this.markers.clearLayers();
          this._popUp = [];

          //Creamos un array para guardar el resultado e imprimirlo en el menu lateral
          const resultado = new Array();

          //Creaos un array para guardar las posiciones y triangular un zoom en el mapa
          const latLong = new Array();

          // Recorrer las gasolineras
          datos.forEach(dato => {

               console.log(dato.attributes);

               /** destructuring para obtener la informacion
                *  Longitud y Latitud
                *  Nombre Gasolinera
                *  Precio Diesel, 95, 98, Optima, Gas y si dispone de cargador electrico
                * 
                */
               const { 
                    attributes: { objectid },
                    attributes: { longitud }, 
                    attributes: { latitud },
                    attributes: { precio_g_1 }, //gasolina 95
                    attributes: { precio_g_3 }, //gasolina 98
                    attributes: { precio_g_5 }, //diesel
                    attributes: { precio_g_6 }, //diesel premiun
                    attributes: { municipio },
                    attributes: { fecha },
                    attributes: { rótulo }
               } = dato;

               let fechaActualizacion = new Date(fecha);
               // Creamos popUps 
               const opcionesPopUp = L.popup()
                         .setContent(`
                         <div class='container-popup mb-2' id='${objectid}'>
                              <div class="card border-0">
                                   <div class='card-header'>
                                        <strong>${rótulo}</strong>
                                   </div>
                                   <div class='card-body'>
                                        <div class='card-title'>
                                             Localidad: <span id='precio'>${municipio}</span>
                                        </div>
                                             <p class='card-text'>Gasolina 95:&emsp;<span id='precio'>${precio_g_1 == null ? '--' : precio_g_1} €</span></p>
                                             <p class='card-text'>Gasolina 98:&emsp;<span id='precio'>${(precio_g_3 == null || precio_g_3 == '') ? '--' :precio_g_3} €</span></p>
                                             <p class='card-text'>Diésel:&emsp;<span id='precio'>${precio_g_5 == null ? '--' : precio_g_5} €</span></p>
                                             <p class='card-text'>Diésel Premiun:&emsp;<span id='precio'>${precio_g_6 == null ? '--' : precio_g_6} €</span></p>
                                        </div>
                                   <div class="card-footer text-muted">
                                        <small>Actualizado a día de: <span id='precio'>${fechaActualizacion.toLocaleDateString()}</span></small>
                                   </div>
                              </div>
                         </div>
                              `);

               // Agregamos el resultado html a nuestro array
               resultado.push(opcionesPopUp);

               // Agregamos latitud y longitud en nuestro array para triangular un zoom en el mapa              
               latLong.push([latitud, longitud]);

               // Agregamos los puntos de las gasolineras en el mapa
               const marker = new L.marker([
                    parseFloat(latitud), 
                    parseFloat(longitud)
               ]).bindPopup(opcionesPopUp, {
                    minWidth: 250,
                    maxWidth: 400
               }).on('click', (e) => {
                    // añadimos efecto hover al div que contiene la informacion del marker
                    //this.efectoHover(e.target._leaflet_id);
               });
               
               // Añadimos el marker al Layer
               this.markers.addLayer(marker);  
               // Añadimos el Layer a nuestro mapa
               this.markers.addTo(this.mapa); 
               
               // Guardamos los markers id y los asociamos con el id del resultado
               this._popUp.push({ marker, 'popupId': objectid });

          });

          // Enviamos al mapa el array de latitud/longitud para triangular el zoom en el mapa
          if ( latLong.length ) this.mapa.fitBounds(latLong);
          

          // Mostramos los resultados en el div Resultados
          this.mostrarResultado(resultado);
     }


     mostrarResultado ( resultados ) {

          //const resultadoDiv = document.querySelector('.resultado');
          resultadoDiv.classList.remove('d-none');
          //comprobamos si devolvio resultados
          if ( resultados.length ) { 

               //recorremos el array para obtener el _content
               resultados.forEach( (resultado) => {
                    resultadoDiv.innerHTML += resultado._content;
               });

          } else {

               let error = document.createElement('h6');
               error.innerHTML = 'No se obtuvieron resultados';
               error.classList.add('bg-warning', 'p-2');
               resultadoDiv.appendChild(error);

          }

          resultadoDiv.classList.add('d-block');
     }

     efectoHover() {
          
     }

     abrirPopup ( idpopup ) {

          let popup;
          this._popUp.forEach(item => {
               if (item.popupId == idpopup ) {                
                    popup = item.marker;
               }
          });
          this.mapa.eachLayer(layer => {
               layer.openPopup([latlng.lat, latlng.lng])
          })      
     }
     
}