class API {
     async obtenerDatos(url){
          
          //obtener los datos de la api
          const datos = await fetch(url);

          const respuesta = await datos.json();

          return {
               respuesta
          }
     }

}