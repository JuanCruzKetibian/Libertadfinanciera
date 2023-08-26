  document.getElementById("loginButton").addEventListener("click", function() {
    Swal.fire({
      title: 'Iniciar sesión',
      html:
        '<input id="email" class="swal2-input" placeholder="Email">' +
        '<input id="password" type="password" class="swal2-input" placeholder="Contraseña">',
      showCancelButton: true,
      confirmButtonText: 'Iniciar sesión',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const email = Swal.getPopup().querySelector('#email').value;
        const password = Swal.getPopup().querySelector('#password').value;
        
        // Simulación de validación (reemplaza con tu lógica real)
        if (email === 'correo@example.com' && password === 'contraseña') {
          // Redirige a la página deseada después de la validación
          window.location.href = 'Paginas/Decision.html';
        } else {
          window.location.href = 'Paginas/Decision.html';
        }
      }
    });
  });

document.getElementById('actualizar-tasa').addEventListener('click', actualizarTasaGanancia);

let tasaDeGanancia = 0;

// Función para actualizar la tasa de ganancia
function actualizarTasaGanancia() {
    const tasaGananciaInput = document.getElementById('tasa-ganancia');
    tasaDeGanancia = parseFloat(tasaGananciaInput.value);

    // Limpiamos el campo de entrada
    tasaGananciaInput.value = '';

    // Mostramos la tasa de ganancia en la tabla
    mostrarTasaEnTabla(tasaDeGanancia);
}

// Función para mostrar la tasa de ganancia en la tabla
function mostrarTasaEnTabla(tasa) {
    const celdaTasa = document.getElementById('celda-tasa');
    celdaTasa.textContent = tasa + "%";
        Swal.fire({
            title: "La tasa de ganancia ha sido registrado con exito.",
            icon: "success",
            confirmButtonText: "Ok",
        });
}


// Almacenamiento de precios de compra por accion, luego seran utilizados para comaprar con precio de hoy
function guardarPrecioCompra() {
    const accionInput = document.getElementById('accion');
    const precioCompraInput = document.getElementById('precio-compra');
    const accion = accionInput.value;
    const precioCompra = parseFloat(precioCompraInput.value);
        if (accion.trim() !== '' && !isNaN(precioCompra)) {
        // Se guarda el precio de compra
        localStorage.setItem(accion, precioCompra);
        // Se vacia el espacio luego de haber guardado los datos en la variable
        accionInput.value = '';
        precioCompraInput.value = '';
        Toastify({
            text: "Precio de compra registrado correctamente.",
            backgroundColor: "green",
            duration: 3000
            }).showToast();
        // Actualizamos la tabla con los datos
        mostrarAccionesYPreciosEnTabla();
        } else {
            Toastify({
                text: "Por favor registre correctamente la accion.",
                backgroundColor: "red",
                duration: 3000
                }).showToast();
        }
}
// Completamos la tabla con los datos recolectados
function mostrarAccionesYPreciosEnTabla() {
    const tablaAcciones = document.getElementById('tabla-acciones');
   
    // Limpiamos la tabla antes de agregar los nuevos datos
    tablaAcciones.innerHTML = `
    <tr>
        <th>Accion</th>
        <th>Precio de Compra</th>
        <th>Decision</th>
    </tr>
`;
            
// Recorremos todas las acciones para colocarlas en la tabla
for (let i = 0; i < localStorage.length; i++) {
    const accion = localStorage.key(i);
    const precioCompra = parseFloat(localStorage.getItem(accion));
     
    const fila = document.createElement('tr');
          
    const celdaAccion = document.createElement('td');
        celdaAccion.textContent = accion;
          
    const celdaPrecioCompra = document.createElement('td');
        celdaPrecioCompra.textContent = precioCompra;
           
    const celdaEliminar = document.createElement('td');
    const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Vendida';
        eliminarBtn.addEventListener('click', function() {
            eliminarAccion(accion);
        Swal.fire({
            title: "Felicidades ha concretado la venta.",
            icon: "success",
            confirmButtonText: "Ok",
        });    
        });
           
    celdaEliminar.appendChild(eliminarBtn);
           
    fila.appendChild(celdaAccion);
    fila.appendChild(celdaPrecioCompra);
    fila.appendChild(celdaEliminar);
          
    tablaAcciones.appendChild(fila);
}}
           
           // Función para eliminar una acción
           function eliminarAccion(accion) {
               localStorage.removeItem(accion);
               mostrarAccionesYPreciosEnTabla();
           }
            // Asociamos el boton con su funcion
           document.getElementById('guardarPrecioCompra').addEventListener('click', guardarPrecioCompra);
            // Mostramos la tabla
           mostrarAccionesYPreciosEnTabla();
           
            // Almacenamiento de los datos cargados sobre los precios de las acciones del dia de hoy
       let registros = [];
        // Vamos agregando datos
       function agregarRegistro() {
           const fechaInput = document.getElementById('fechaP1');
           const accionInput = document.getElementById('accionP1');
           const precioHoyInput = document.getElementById('precio-hoyP1');
            const fecha = fechaInput.value;
           const accion = accionInput.value;
           const precioHoy = parseFloat(precioHoyInput.value);
            // Cruzamos el dato de la accion con la tenencia para hacer la relacion.
           if (!localStorage.getItem(accion)) {
            Toastify({
                text: "Disculpe pero usted no tiene tenencia de esa accion.",
                backgroundColor: "red",
                duration: 3000
                }).showToast();
               return;
           }
            if (accion.trim() !== '' && !isNaN(precioHoy)) {
               // Creamos un objeto con los datos de la accion y precio de hoy
               const nuevoRegistro = {
                   fecha: fecha,
                   accion: accion,
                   precioCompra: obtenerPrecioCompra(accion), // Obtenemos el precio de compra almacenado
                   precioHoy: precioHoy
               };
                // Agregamos el valor nuevo
               registros.push(nuevoRegistro);
                // Limpiamos los campos de entrada
               fechaInput.value = '';
               accionInput.value = '';
               precioHoyInput.value = '';
                // Mostramos los datos en la tabla
               mostrarRegistrosEnTabla();
           } else {
               Swal.fire({
                title: "Por favor ingrese bien los datos",
                icon: "error",
                confirmButtonText: "Ok",
            }); 
           }
       }
        // Funcion para limpiar completamente la variable de registros y limpiar la tabla
       function limpiarRegistros() {
           registros = [];
           mostrarRegistrosEnTabla();
       }
        // Funcion para mostrar los registros en la tabla
       function mostrarRegistrosEnTabla() {
           const tablaRegistros = document.getElementById('tabla-registros');
            // Limpiamos la tabla antes de agregar los nuevos registros
           tablaRegistros.innerHTML = `
               <tr>
                   <th>Fecha</th>
                   <th>Accion</th>
                   <th>Precio de Compra</th>
                   <th>Precio de Hoy</th>
                   <th>Resultado</th>
               </tr>
           `;
            // Recorremos los registros y vamos completando los datos en la tabla
           registros.forEach(registro => {
               const fila = document.createElement('tr');
               
               const celdafecha = document.createElement('td');
               celdafecha.textContent = registro.fecha;
                const celdaAccion = document.createElement('td');
               celdaAccion.textContent = registro.accion;
                const celdaPrecioCompra = document.createElement('td');
               celdaPrecioCompra.textContent = registro.precioCompra;
                const celdaPrecioHoy = document.createElement('td');
               celdaPrecioHoy.textContent = registro.precioHoy;
               // Armamos el if para ver si vendemos o no la accion
               const celdaResultado = document.createElement('td');
               const porcentajeCompra = registro.precioCompra * (1 + (tasaDeGanancia/100));
               if (registro.precioHoy >= porcentajeCompra) {
                   celdaResultado.textContent = "Momento de veder la posicion y capturar el beneficio del " + tasaDeGanancia + "%";
                   Swal.fire({
                    title: "Momento de veder la posicion y capturar el beneficio del " + tasaDeGanancia + "%",
                    icon: "succes",
                    confirmButtonText: "Ok",
                });
               } else {
                   celdaResultado.textContent = 'Todavia no es momento de vender la posicion.';
                   Swal.fire({
                    title: "Todavia no es momento de vender la posicion.",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
               }
               fila.appendChild(celdafecha);
               fila.appendChild(celdaAccion);
               fila.appendChild(celdaPrecioCompra);
               fila.appendChild(celdaPrecioHoy);
               fila.appendChild(celdaResultado);
                tablaRegistros.appendChild(fila);
           });
       }
        function obtenerPrecioCompra(accion) {
           const precioCompraString = localStorage.getItem(accion);
           return precioCompraString ? parseFloat(precioCompraString) : 0;
       }
        // Asociamos la funcion agregarRegistro al evento click del boton "Completar Mensaje"
       document.getElementById('completar').addEventListener('click', agregarRegistro);
        // Asociamos la funcion limpiarRegistros al evento click del boton "Limpiar Registros"
       document.getElementById('limpiar').addEventListener('click', limpiarRegistros);
        // Mostramos los registros al cargar la pagina por primera vez
       mostrarRegistrosEnTabla();