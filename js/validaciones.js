// ===================================================
// VALIDACIONES DE FORMULARIO - WORKCLOTHES
// ===================================================

// Funciones auxiliares globales para el DOM
function mostrarError(input, spanError, mensaje) {
    input.classList.add('input-error');
    spanError.textContent = mensaje;
    spanError.style.display = 'block';
}

function limpiarError(input, spanError) {
    input.classList.remove('input-error');
    spanError.textContent = '';
    spanError.style.display = 'none';
}

// ---------------------------------------------------
// 1. FORMULARIO DE LOGIN (CON ROL ADMIN Y CLIENTE)
// ---------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const inputEmail = document.getElementById('email');
            const inputPass = document.getElementById('password');
            const errorEmail = document.getElementById('error-email');
            const errorPass = document.getElementById('error-password');

            limpiarError(inputEmail, errorEmail);
            limpiarError(inputPass, errorPass);

            let esValido = true;

            // Validación de correo
            const valorEmail = inputEmail.value.trim();
            const dominiosValidos = ['@gmail.com', '@duoc.cl', '@profesor.duoc.cl'];
            const tieneDominioValido = dominiosValidos.some(dominio => valorEmail.endsWith(dominio));

            if (valorEmail === '') {
                mostrarError(inputEmail, errorEmail, 'El correo electrónico es obligatorio.');
                esValido = false;
            } else if (!tieneDominioValido) {
                mostrarError(inputEmail, errorEmail, 'Debe ser un correo válido (@gmail.com, @duoc.cl o @profesor.duoc.cl).');
                esValido = false;
            }

            // Validación de contraseña
            const valorPass = inputPass.value.trim();
            if (valorPass === '') {
                mostrarError(inputPass, errorPass, 'La contraseña es obligatoria.');
                esValido = false;
            } else if (valorPass.length < 4 || valorPass.length > 10) {
                mostrarError(inputPass, errorPass, 'La contraseña debe tener entre 4 y 10 caracteres.');
                esValido = false;
            }

            // Redirección según rol
            if (esValido) {
                let rol = 'cliente';
                let rutaDestino = 'index.html';

                // Si el correo es el del administrador, redirige a admin.html
                if (valorEmail === 'adminworkclothes@gmail.com' || valorEmail.startsWith('admin.')) {
                    rol = 'administrador';
                    rutaDestino = 'admin.html';
                }

                // Guardar la sesión en localStorage
                const sesion = {
                    email: valorEmail,
                    rol: rol,
                    fechaLogin: new Date().toLocaleTimeString()
                };
                localStorage.setItem('sesionUsuario', JSON.stringify(sesion));

                alert(`Acceso concedido como [${rol.toUpperCase()}]. Redirigiendo...`);
                formLogin.reset();
                window.location.href = rutaDestino;
            }
        });
    }
});

// ---------------------------------------------------
// 2. FORMULARIO DE REGISTRO Y SELECTOR DINÁMICO
// ---------------------------------------------------
const comunasPorRegion = {
    metropolitana: ["Santiago", "Maipú", "Peñaflor", "Providencia", "Puente Alto"],
    valparaiso: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
    biobio: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Coronel"]
};

document.addEventListener('DOMContentLoaded', () => {
    const selectRegion = document.getElementById('reg-region');
    const selectComuna = document.getElementById('reg-comuna');
    const formRegistro = document.getElementById('form-registro');

    // Selector dinámico de comunas
    if (selectRegion && selectComuna) {
        selectRegion.addEventListener('change', () => {
            const regionSeleccionada = selectRegion.value;
            selectComuna.innerHTML = '';

            if (regionSeleccionada && comunasPorRegion[regionSeleccionada]) {
                selectComuna.disabled = false;
                selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';

                comunasPorRegion[regionSeleccionada].forEach(comuna => {
                    const opcion = document.createElement('option');
                    opcion.value = comuna.toLowerCase();
                    opcion.textContent = comuna;
                    selectComuna.appendChild(opcion);
                });
            } else {
                selectComuna.disabled = true;
                selectComuna.innerHTML = '<option value="">Primero elige una región</option>';
            }
        });
    }

    // Validación registro
    if (formRegistro) {
        formRegistro.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const inputNombre = document.getElementById('reg-nombre');
            const inputRun = document.getElementById('reg-run');
            const inputEmail = document.getElementById('reg-email');
            const inputPass = document.getElementById('reg-password');

            const errorNombre = document.getElementById('error-reg-nombre');
            const errorRun = document.getElementById('error-reg-run');
            const errorEmail = document.getElementById('error-reg-email');
            const errorPass = document.getElementById('error-reg-password');
            const errorRegion = document.getElementById('error-reg-region');
            const errorComuna = document.getElementById('error-reg-comuna');

            [inputNombre, inputRun, inputEmail, inputPass, selectRegion, selectComuna].forEach(el => el.classList.remove('input-error'));
            [errorNombre, errorRun, errorEmail, errorPass, errorRegion, errorComuna].forEach(sp => { sp.textContent = ''; sp.style.display = 'none'; });

            let esValido = true;

            if (inputNombre.value.trim() === '') {
                mostrarError(inputNombre, errorNombre, 'El nombre completo es obligatorio.');
                esValido = false;
            }

            const valorRun = inputRun.value.trim();
            const formatoRun = /^[0-9]+-[0-9kK]{1}$/;
            if (valorRun === '') {
                mostrarError(inputRun, errorRun, 'El RUN es obligatorio.');
                esValido = false;
            } else if (!formatoRun.test(valorRun)) {
                mostrarError(inputRun, errorRun, 'Ingresa un RUN válido con guión (ej: 19876543-K).');
                esValido = false;
            }

            const valorEmail = inputEmail.value.trim();
            const dominiosValidos = ['@gmail.com', '@duoc.cl', '@profesor.duoc.cl'];
            const tieneDominio = dominiosValidos.some(d => valorEmail.endsWith(d));
            if (valorEmail === '') {
                mostrarError(inputEmail, errorEmail, 'El correo electrónico es obligatorio.');
                esValido = false;
            } else if (!tieneDominio) {
                mostrarError(inputEmail, errorEmail, 'Debe terminar en @gmail.com, @duoc.cl o @profesor.duoc.cl');
                esValido = false;
            }

            const valorPass = inputPass.value.trim();
            if (valorPass.length < 4 || valorPass.length > 10) {
                mostrarError(inputPass, errorPass, 'La contraseña debe tener entre 4 y 10 caracteres.');
                esValido = false;
            }

            if (selectRegion.value === '') {
                mostrarError(selectRegion, errorRegion, 'Debes seleccionar una región.');
                esValido = false;
            }
            if (selectComuna.value === '') {
                mostrarError(selectComuna, errorComuna, 'Debes seleccionar una comuna.');
                esValido = false;
            }

            if (esValido) {
                alert('¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.');
                formRegistro.reset();
                window.location.href = 'login.html';
            }
        });
    }
});

// ---------------------------------------------------
// 3. FORMULARIO DE CONTACTO
// ---------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const formContacto = document.getElementById('form-contacto');

    if (formContacto) {
        formContacto.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const inputNombre = document.getElementById('con-nombre');
            const inputEmail = document.getElementById('con-email');
            const inputAsunto = document.getElementById('con-asunto');
            const inputMensaje = document.getElementById('con-mensaje');

            const errorNombre = document.getElementById('error-con-nombre');
            const errorEmail = document.getElementById('error-con-email');
            const errorAsunto = document.getElementById('error-con-asunto');
            const errorMensaje = document.getElementById('error-con-mensaje');

            [inputNombre, inputEmail, inputAsunto, inputMensaje].forEach(el => el.classList.remove('input-error'));
            [errorNombre, errorEmail, errorAsunto, errorMensaje].forEach(sp => { sp.textContent = ''; sp.style.display = 'none'; });

            let esValido = true;

            if (inputNombre.value.trim() === '') {
                mostrarError(inputNombre, errorNombre, 'El nombre es obligatorio.');
                esValido = false;
            }

            const valorEmail = inputEmail.value.trim();
            const dominiosValidos = ['@gmail.com', '@duoc.cl', '@profesor.duoc.cl'];
            const tieneDominio = dominiosValidos.some(d => valorEmail.endsWith(d));
            if (valorEmail === '') {
                mostrarError(inputEmail, errorEmail, 'El correo electrónico es obligatorio.');
                esValido = false;
            } else if (!tieneDominio) {
                mostrarError(inputEmail, errorEmail, 'Debe terminar en @gmail.com, @duoc.cl o @profesor.duoc.cl');
                esValido = false;
            }

            if (inputAsunto.value.trim() === '') {
                mostrarError(inputAsunto, errorAsunto, 'El asunto es obligatorio.');
                esValido = false;
            }

            const valorMensaje = inputMensaje.value.trim();
            if (valorMensaje === '') {
                mostrarError(inputMensaje, errorMensaje, 'El mensaje no puede estar vacío.');
                esValido = false;
            } else if (valorMensaje.length > 500) {
                mostrarError(inputMensaje, errorMensaje, `Máximo 500 caracteres permitidos (tienes ${valorMensaje.length}).`);
                esValido = false;
            }

            if (esValido) {
                alert('¡Mensaje enviado con éxito! Nos comunicaremos contigo a la brevedad.');
                formContacto.reset();
            }
        });
    }
});