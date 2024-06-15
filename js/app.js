let cliente={
    mesa: "",
    hora: "",
    pedido: []
};
const categorias ={
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres',
    4: 'Entradas'
}
const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarClinte);

function guardarClinte() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa, hora].some(campo => campo === "");

    if (camposVacios) {
        const existeAlerta=document.querySelector('.invalid-feedback');
        if (!existeAlerta) {   
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }
        return;
    }

    //Asignar datos deñ formulario a cliente
    cliente={
        ...cliente,
        mesa: mesa,
        hora: hora, 
    }

    //ocultar MOdal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    //mostrar secciones
    mostrarSecciones();

    //Obtener platillos de la API de Json Serve
    obtenerPlatillos();

}
function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => {
        seccion.classList.remove('d-none');
    });
}

function obtenerPlatillos() {
    url="http://localhost:4000/platillos";
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => mostrarPlatilLos(resultado))
    .catch(error => console.log(error));
}

function mostrarPlatilLos(platillos) { 
    const contenedorPlatillos = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria]; //categorias se refiere al objeto categorias en la llave platillo.categoria

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.value = 0;
        inputCantidad.min = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        //funcion que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad});
        };

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);



        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        contenedorPlatillos.appendChild(row);
    });
}

function agregarPlatillo(producto) {
    //extraer el pedido
    let {pedido} = cliente
    
    // test producto mayor a cero 
    if (producto.cantidad > 0) {
        //comporbarsi ya existe el producto el articlo en el pedido
        if(pedido.some(articulo =>articulo.id === producto.id)){
            //El articlo ya existe, cambiar cantidad
            const pedidoActualizado = pedido.map(articulo =>{
                if(articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad
                }
                return articulo;
            });
            //se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        }else{
            //El articlo no existe, lo agregamos a el pedido
            cliente.pedido = [...pedido, producto]
        }    
    }else{
        //Eliminar elementos cuando la cnatidad es 0
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);

        cliente.pedido = [...resultado];
    }
    console.log(cliente.pedido);
    //limpiar el código html previo
    limpiarHtml();

    if (cliente.pedido.length) {
        //mostar el resumen
        actualizarResumen();
    }else{
        mensajePedidoVacio()
    }
}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');
    
    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadown');

    //informacion de la mesa
    const mesa = document.createElement('P');
    mesa.textContent = `Mesa: `;
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //informacion de la hora
    const hora = document.createElement('P');
    hora.textContent = `Hora: `;
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    //Agregar a los elementos padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la seccion
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos consumidos';
    heading.classList.add('my-4', 'text-center');

    //iterar sobr eel array de pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');
    const {pedido} = cliente;

    pedido.forEach(articulo => {
        const {nombre, cantidad, precio, id} = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        //cantidad del articulo
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadSpan = document.createElement('span');
        cantidadSpan.textContent = cantidad;
        cantidadSpan.classList.add('fw-normal');

        //precio del articulo
        const precioEl = document.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioSpan = document.createElement('span');
        precioSpan.textContent = `$${precio}`;
        precioSpan.classList.add('fw-normal');

        //subtotal del articulo

        const subtotalEl = document.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotail: ';

        const subtotalSpan = document.createElement('span');
        subtotalSpan.textContent = calcularSubtotal(precio, cantidad);
        subtotalSpan.classList.add('fw-normal');

        //boton de eliminar
        const boton = document.createElement('button');
        boton.classList.add('btn', 'btn-danger', 'btn-sm');
        boton.textContent = 'Eliminar';
        boton.onclick = function () {
            EliminarProducto(id);        
        };

        //agregar valor a sus contenedores
        cantidadEl.appendChild(cantidadSpan);
        precioEl.appendChild(precioSpan);
        subtotalEl.appendChild(subtotalSpan);


        
        //agregar elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(boton);

        //agregar lista al grupo principal
        grupo.appendChild(lista);

        
    });
    //agregar al contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);



    contenido.appendChild(resumen);

    //Mostrar formulario de proponas
    formularioPropinas();

    
}
function EliminarProducto(id) {
    const {pedido} = cliente;
    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

      //limpiar el código html previo
    limpiarHtml();

    if (cliente.pedido.length) {
        //mostar el resumen
        actualizarResumen();
    }else{
        mensajePedidoVacio()
    }
    //el producto se elimino por lo tanto regresamos la cantidad a 0 en los inputs
    const inputCantidad = document.querySelector(`#producto-${id}`);
    inputCantidad.value = 0;
}

function limpiarHtml() {
    const contenido = document.querySelector('#resumen .contenido');
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }

}

function calcularSubtotal(precio, cantidad) {
    return `$ ${precio * cantidad}`;
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);

}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');
    
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadown');

    const heading = document.createElement('h3');
    heading.textContent = 'Propina';
    heading.classList.add('my-4', 'text-center');

    //Radio button 10 %
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = 10;
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularpropina

    const radio10Label = document.createElement('label');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10div = document.createElement('div');
    radio10div.classList.add('form-check');

    radio10div.appendChild(radio10);
    radio10div.appendChild(radio10Label);

    //Radio button 25 %
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = 25;
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularpropina

    const radio25Label = document.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25div = document.createElement('div');
    radio25div.classList.add('form-check');


    radio25div.appendChild(radio25);
    radio25div.appendChild(radio25Label);

    //Radio button 50 %
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = 50;
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularpropina

    const radio50Label = document.createElement('label');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50div = document.createElement('div');
    radio50div.classList.add('form-check');


    radio50div.appendChild(radio50);
    radio50div.appendChild(radio50Label);

    //agregar al div principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10div);
    divFormulario.appendChild(radio25div);
    divFormulario.appendChild(radio50div);

    //agregar al formulario
    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);
}

function calcularpropina() {
    const {pedido} = cliente;
    let subtotal = 0;

    //caclcular el subtotal a pagar
    pedido.forEach(articulo => {
        const {precio, cantidad} = articulo;
        subtotal += precio * cantidad;
    });

    //Seleccionar el radio button con la propina del cliente
    const propinaSelecionada = document.querySelector('input[name="propina"]:checked').value;
    
    //calcular la propina
    const propina= ((subtotal * parseInt(propinaSelecionada)) / 100);
    console.log();

    //caclular total a pagar

    const total = subtotal + propina;

    mostrarTotalHTML(subtotal, total, propina);
}  

function mostrarTotalHTML(subtotal, total, propina) {

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar', 'my-5');
   
    //Subototal
    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.classList.add('fw-bold', 'fs-4', 'mt-2');
    subtotalParrafo.textContent = `Subtotal: `;

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$ ${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    //Propina
    const propinaParrafo = document.createElement('P');
    propinaParrafo.classList.add('fw-bold', 'fs-4', 'mt-2');
    propinaParrafo.textContent = `Propina: `;

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$ ${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    //Total
    const totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fw-bold', 'fs-4', 'mt-2');
    totalParrafo.textContent = `Total a pagar: `;

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$ ${total}`;

    totalParrafo.appendChild(totalSpan);

    //eliminar el ultimo resultado
    const totalpagarDiv = document.querySelector('.total-pagar');
    if (totalpagarDiv) {
        totalpagarDiv.remove();
    }


    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);
    
    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);

}