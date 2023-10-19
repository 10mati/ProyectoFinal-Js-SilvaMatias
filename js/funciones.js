const guardarproductosLS = (productos) => {
  localStorage.setItem("productos", JSON.stringify(productos));
}
const cargarproductosLS = () => {
  return JSON.parse(localStorage.getItem("productos")) || [];
}

const url ="js/productos.js";

fetch(url)
.then(resp => resp.json())
.then(data => renderproductos(data))


const renderproductos = () => {
  const productos = cargarproductosLS();
  let contenidoHTML = "";

  productos.forEach(producto => {
    contenidoHTML += `<div class="col-sm-4 mb-2 mb-sm-5 text-center"> 
    <div class="row">
        <div class="card-deck">
        <img src="${producto.img}"  width="100%" alt="${producto.nombre}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">$${producto.precio}</p>
          <a href="#" class="btn btn-dark" onclick ="agregarProductoCarrito(${producto.id})"> Agregar (+)</a>
        </div>
        </div>
      </div>
      </div> `;
  });
  
  document.getElementById("Productos").innerHTML = contenidoHTML;
  
}

const renderCarrito = () => {
  const productos = cargarCarritoLS();
  let contenidoHTML;

  if (cantProductosCarrito() > 0) {
    contenidoHTML = `<table class="table table-hover ">
      <tr>
      <td colspan="7" class="text-end"><button class="btn btn-outline-danger" onclick="vaciarCarrito()" title="Vaciar Carrito">Vaciar Carrito</button></td>
    
      </tr>`;

    productos.forEach(producto => {
      contenidoHTML += `<tr>
          <td><img src="${producto.img}" alt="${producto.nombre}" width="64"></td>
          <td class="align-middle">${producto.nombre}</td>
          <td class="align-middle">$${producto.precio}</td>
          <td class="align-middle"><button class="btn  rounded-circle" onclick="decrementarCantidadProducto(${producto.id})">-</button> ${producto.cantidad} <button class="btn rounded-circle" onclick="incrementarCantidadProducto(${producto.id})">+</button></td>
          <td class="align-middle">$${producto.precio * producto.cantidad}</td>
          <td class="align-middle text-end"><img src="js/img/trash.svg" alt="Eliminar" width="24" onclick="eliminarProductoCarrito(${producto.id})"></td>
          </tr>`;
    });

    contenidoHTML += `<tr>
      <td colspan="4">Total</td>
      <td><b>$${sumaProductosCarrito()}</b></td>
      </tr>
      </table>`;

      contenidoHTML += `<tr>
      <td><button class="btn btn-dark " onclick="finalizarCompra()">Finalizar Compra</button></td>
      </tr>
      </table>`;
  } else {
    contenidoHTML = `<div class="alert alert-dark my-5 text-center" role="alert">No se encontaron Productos en el Carrito!</div>`;
  }

  document.getElementById("Productos").innerHTML = contenidoHTML;
}


const guardarCarritoLS = (carrito) => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

const cargarCarritoLS = () => {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

const guardarProductoLS = (id) => {
  localStorage.setItem("producto", JSON.stringify(id));
}

const cargarProductoLS = () => {
  return JSON.parse(localStorage.getItem("producto")) || [];
}



const vaciarCarrito = () => {
 
  localStorage.removeItem("carrito");
  renderCarrito();
  renderBotonCarrito();
 
}

const agregarProductoCarrito = (id) => {

  const carrito = cargarCarritoLS();

  if (estaEnElCarrito(id)) {
    const producto = carrito.find(item => item.id === id);
    producto.cantidad += 1;
  } else {
    const producto = buscarProducto(id);
    producto.cantidad = 1;
    carrito.push(producto);
  }
  Swal.fire({
  titleText:'Producto Agregado!',
  toast: true,
  position:'top-end',
  width: '280px',
  timer:1000,
  icon: 'success',
  showConfirmButton: false });
  guardarCarritoLS(carrito);
  renderBotonCarrito();
}

const eliminarProductoCarrito = (id) => {
  const carrito = cargarCarritoLS();
  const nuevoCarrito = carrito.filter(item => item.id !== id);
  guardarCarritoLS(nuevoCarrito);
  renderCarrito();
  renderBotonCarrito();
}

const incrementarCantidadProducto = (id) => {
  const carrito = cargarCarritoLS();
  const producto = carrito.find(item => item.id === id);
  producto.cantidad += 1;
  guardarCarritoLS(carrito);
  renderCarrito();
  renderBotonCarrito();
}

const decrementarCantidadProducto = (id) => {
  const carrito = cargarCarritoLS();
  const producto = carrito.find(item => item.id === id);

  if (producto.cantidad > 1) {
    producto.cantidad -= 1;
    guardarCarritoLS(carrito);
    renderCarrito();
    renderBotonCarrito();
  } else {
    eliminarProductoCarrito(id);
  }
}

const buscarProducto = (id) => {
  const productos = cargarproductosLS();
  let producto = productos.find(item => item.id === id);

  return producto;
}

const estaEnElCarrito = (id) => {
  const productos = cargarCarritoLS();

  return productos.some(item => item.id === id);
}

const cantProductosCarrito = () => {
  const carrito = cargarCarritoLS();

  return carrito.reduce((acc, item) => acc += item.cantidad, 0);
}

const sumaProductosCarrito = () => {
  const carrito = cargarCarritoLS();

  return carrito.reduce((acc, item) => acc += item.precio * item.cantidad, 0);
}

const renderBotonCarrito = () => {
  let totalCarrito = document.getElementById("totalCarrito");
  totalCarrito.innerHTML = cantProductosCarrito();
}

const finalizarCompra = ()=> {
  Swal.fire({
    title: 'Confirma la compra?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, comprar!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title:'GRACIAS POR SU COMPRA.',
    })
      vaciarCarrito ();
    }
  })

}
