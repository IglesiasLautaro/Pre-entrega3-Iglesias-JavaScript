

class DataBase{
    constructor(){
        this.productos = [];
    }


    // METODO PARA PEDIR LA LISTA DE PRODUCTOS 
    async traerProductos(){
        const response = await fetch("json/productos.json");
        this.productos = await response.json();
        return this.productos;
    }

    productoPorId(id){
        return this.productos.find((producto) => producto.id === id);
    }

    productoPorNombre(palabra){
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
    }
    registroPorCategoria(categoria){
        return this.productos.filter((producto) => producto.categoria == categoria);
    }
}

class Carrito{
    constructor(){

    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));

    this.carrito = carritoStorage || [];
    this.total = 0;
    this.totalProductos = 0;

    this.listar();

    }

    estaEnCarrito({ id }){
        return this.carrito.find((producto) => producto.id === id);
    }

    agregarProductoCarrito(producto){
        let productoEnCarrito = this.estaEnCarrito(producto);
        if(productoEnCarrito){
            // Esto es para sumar mas cantidad de productos
            productoEnCarrito.cantidad++;
        } else {
            // Agregar al carrito
            this.carrito.push({...producto, cantidad: 1});
            localStorage.setItem("carrito", JSON.stringify(this.carrito));
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    quitarProducto(id){
        const indice = this.carrito.findIndex((producto) => producto.id === id);
        if (this.carrito[indice].cantidad > 1){
            this.carrito[indice].cantidad--;
        } else {
            // Sino que me lo borre del carrito
            this.carrito.splice(indice, 1);
        }

        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    vaciar(){
        this.carrito = [];
        localStorage.removeItem("carrito");
        this.listar();
    }
    listar(){
        this.total = 0;
        this.totalProductos = 0;
        productosCarrito.innerHTML = "";
        for (const producto of this.carrito){
            productosCarrito.innerHTML += `
            <div class="producto">
            <h4>${producto.nombre}</h4>
            <p>$ ${producto.precio}</p>
            <a href="#" data-id="${producto.id}" class="btnQuitar">Quitar del carrito</a><br><br>
            </div>
            `
            this.total += (producto.precio * producto.cantidad);
            this.totalProductos += producto.cantidad;
        }
        // BOTONES DE QUITAR
        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar){
            boton.onclick = (event) => {
                event.preventDefault();
                this.quitarProducto(Number(boton.dataset.id));
            }
        }
        // Actualizamos las variables del carrito
        spanCantidadProductos.innerText = this.totalProductos;
        spanTotalCarrito.innerText = this.total;
    }
}

// CLASE MOLDE PARA LOS PRODUCTOS
class Producto{
    constructor(nombre, precio, categoria, id, imagen = false, ){
        this.nombre = nombre,
        this.precio = precio,
        this.categoria = categoria,
        this.id = id,
        this.imagen = imagen
    }
}
// INSTANCIAMOS LA BASE DE DATOS
const db = new DataBase();

// Vinculamos a traves de DOM los elementos de nuestro HTML con JS
const productosDataBase =  document.querySelector("#productos");
const productosCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const formBuscar = document.querySelector("#formBuscar");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("#section h1")
const botonComprar = document.querySelector(".btnComprar")
const botonesCategorias = document.querySelectorAll(".btnCategoria");

botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        const productoPorCategoria = db.registroPorCategoria(boton.innerText);
        cargarProductos(productoPorCategoria);
    })
})



// Llamamos a la funcion cargarProductos
db.traerProductos().then((productos) => cargarProductos(productos));


// Registros de nuestra base de datos en el HTML
function cargarProductos(productos){
    // const productos = db.traerProductos();
    productosDataBase.innerHTML = "";
    for (const producto of productos){
        productosDataBase.innerHTML += `
        <div class="producto">
        <img src="img/${producto.imagen}" width="150px">
        <h4>${producto.nombre}</h4>
        <p>$ ${producto.precio}</p>
        <p><a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a></p>
        </div>
        `;
    }

    // Botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    for (const boton of botonesAgregar){
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const id = Number(boton.dataset.id);
            const producto = db.productoPorId(id);
            carrito.agregarProductoCarrito(producto);
        });
    }
}



// Evento buscador
formBuscar.addEventListener("submit", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(db.productoPorNombre(palabra.toLowerCase()));
});

inputBuscar.addEventListener("keyup", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(db.productoPorNombre(palabra.toLowerCase()));

    const productos = db.productoPorNombre(palabra.toLowerCase());

    cargarProductos(productos);
});

botonComprar.addEventListener("click", () => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Su compra ha sido realizada con exito!',
        showConfirmButton: false,
        timer: 1500
      })
      carrito.vaciar();
})




// INSTANCIAMOS EL CARRITO
const carrito = new Carrito();



function openNav() {
    document.getElementById("sideNavigation").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}
function closeNav() {
    document.getElementById("sideNavigation").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

