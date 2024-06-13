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


        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        contenedorPlatillos.appendChild(row);
    });
}