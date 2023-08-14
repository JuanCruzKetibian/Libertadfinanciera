function registrarUsuario() {
    var email = document.getElementById("email").value;
    var contraseña = document.getElementById("contraseña").value;

    // Aquí puedes agregar código para validar los campos si es necesario
    // Restablecer los valores de los campos a cadena vacía
    document.getElementById("email").value = "";
    document.getElementById("contraseña").value = "";
}

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
        alert('Precio de compra guardado exitosamente.');
        // Actualizamos la tabla con los datos
        mostrarAccionesYPreciosEnTabla();
        } else {
        alert('Por favor, ingrese datos validos.');
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
               alert('Disculpe pero usted no tiene tenencia de esa accion. Ingrese bien su nombre.');
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
               alert('Por favor, ingrese datos validos.');
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
               } else {
                   celdaResultado.textContent = 'Todavia no es momento de vender la posicion.';
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