// ===================================================
// GESTIÓN DEL CARRITO CON LOCALSTORAGE
// ===================================================

// 1. Obtener la lista de productos guardada en el navegador
function obtenerCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

// 2. Guardar el arreglo actualizado en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// 3. Actualizar el número del carrito en la barra de navegación
function actualizarContadorCarrito() {
    const contadorElemento = document.getElementById('cart-count');
    if (!contadorElemento) return;

    const carrito = obtenerCarrito();
    let totalPrendas = 0;

    carrito.forEach(item => {
        totalPrendas += item.cantidad;
    });

    contadorElemento.textContent = totalPrendas;
}

// 4. Agregar una prenda al carrito (desde catálogo o portada)
function agregarAlCarrito(idProducto) {
    // Buscar la prenda en el arreglo cargado desde datos.js
    const prendaEncontrada = productos.find(p => p.id === idProducto);
    if (!prendaEncontrada) return;

    let carrito = obtenerCarrito();

    // Comprobar si ya estaba en el carrito para sumar cantidad
    const itemExistente = carrito.find(item => item.id === idProducto);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            id: prendaEncontrada.id,
            nombre: prendaEncontrada.nombre,
            precio: prendaEncontrada.precio,
            imagen: prendaEncontrada.imagen,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    alert(`Se agregó "${prendaEncontrada.nombre}" al carrito.`);
}

// 5. Modificar cantidad (+ o -) desde la vista carrito.html
function cambiarCantidad(idProducto, cambio) {
    let carrito = obtenerCarrito();
    const item = carrito.find(item => item.id === idProducto);

    if (item) {
        item.cantidad += cambio;
        // Si la cantidad llega a 0, se elimina del arreglo
        if (item.cantidad <= 0) {
            carrito = carrito.filter(i => i.id !== idProducto);
        }
    }

    guardarCarrito(carrito);
    renderizarCarrito();
}

// 6. Eliminar una prenda directamente con la cruz (x)
function eliminarDelCarrito(idProducto) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== idProducto);
    guardarCarrito(carrito);
    renderizarCarrito();
}

// 7. Mostrar la lista y los totales en la tabla de carrito.html
function renderizarCarrito() {
    const contenedor = document.getElementById('contenedor-items');
    const subtotalElemento = document.getElementById('subtotal-precio');
    const totalElemento = document.getElementById('total-precio');

    // Si la página actual no tiene la sección de carrito, salimos
    if (!contenedor) return;

    const carrito = obtenerCarrito();
    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div style="background: white; padding: 2.5rem; border-radius: 6px; border: 1px solid #e5e7eb; text-align: center;">
                <p style="color: #6b7280; font-size: 1.1rem; margin-bottom: 1rem;">Tu carrito está vacío actualmente.</p>
                <a href="productos.html" class="btn-principal" style="font-size: 0.9rem; padding: 0.6rem 1.4rem;">Explorar Catálogo</a>
            </div>
        `;
        if (subtotalElemento) subtotalElemento.textContent = '$0';
        if (totalElemento) totalElemento.textContent = '$0';
        return;
    }

    let sumaTotal = 0;

    carrito.forEach(item => {
        const subtotalFila = item.precio * item.cantidad;
        sumaTotal += subtotalFila;

        const fila = document.createElement('article');
        fila.className = 'item-fila';
        fila.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="item-img">
            <div class="item-info">
                <h3>${item.nombre}</h3>
                <p class="item-precio">$${item.precio.toLocaleString('es-CL')}</p>
            </div>
            <div class="item-controles">
                <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <span class="cantidad-num">${item.cantidad}</span>
                <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, 1)">+</button>
            </div>
            <p class="item-subtotal">$${subtotalFila.toLocaleString('es-CL')}</p>
            <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})" title="Eliminar">&times;</button>
        `;
        contenedor.appendChild(fila);
    });

    if (subtotalElemento) subtotalElemento.textContent = `$${sumaTotal.toLocaleString('es-CL')}`;
    if (totalElemento) totalElemento.textContent = `$${sumaTotal.toLocaleString('es-CL')}`;
}

// 8. Ejecutar al cargar la página en el navegador
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    renderizarCarrito();
});