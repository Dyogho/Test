// 5 colores básicos para sus elementos
let indiceColor = 0; // Variable para el índice del color seleccionado

function colorAleatorio() {
    const coloresBasicos = [
        { r: 255, g: 0, b: 0 },    // Rojo
        { r: 0, g: 255, b: 0 },    // Verde
        { r: 0, g: 0, b: 255 },    // Azul
        { r: 255, g: 255, b: 0 },  // Amarillo
        { r: 128, g: 0, b: 128 }   // Morado
    ];

    // Selecciona el color básico según el índice actual
    const color = coloresBasicos[indiceColor];
    // Incrementa el índice para seleccionar el próximo color la próxima vez
    indiceColor = (indiceColor + 1) % coloresBasicos.length;

    return color;
}

// Función para convertir grados a radianes
function aRadianes(grados) {
    return grados * (Math.PI / 180.0);
}

// Función para generar un número aleatorio dentro de un rango dado
function rangoAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función de easing (suavizado) utilizando una función seno
function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

// Función para obtener el porcentaje de un valor dentro de un rango dado
function obtenerPorcentaje(input, min, max) {
    return (((input - min) * 100) / (max - min)) / 100;
}

// Definición de dimensiones
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ancho = canvas.width;
const alto = canvas.height;

// Definición del centro y radio del círculo de la rueda
const centroX = ancho / 2;
const centroY = alto / 2;
const radio = Math.min(ancho, alto) / 2 - 10;

// Obtención de los elementos de la ruleta desde el textarea
let elementos = document.getElementById("textarea").value.trim().split("\n").filter(e => e !== '');
let tachados = new Set(); // Conjunto para mantener un registro de los elementos tachados

// Inicialización de variables para el dibujo de la rueda
let gradosActuales = 0;
let paso = 360 / elementos.length; // Paso angular para cada elemento
let colores = []; // Arreglo para almacenar los colores de los elementos
let gradosElementos = {}; // Objeto para almacenar los grados de inicio y fin de cada elemento

// Generación de colores aleatorios para cada elemento
for (let i = 0; i < elementos.length; i++) {
    colores.push(colorAleatorio());
}

// Función para crear y dibujar la rueda
function crearRueda() {
    // Actualización de los elementos desde el textarea
    elementos = document.getElementById("textarea").value.trim().split("\n").filter(e => e !== '');
    // Filtrado de elementos ya tachados
    elementos = elementos.filter(e => !tachados.has(e) && !e.includes('~~'));
    // Actualización del paso angular
    paso = 360 / elementos.length;
    colores = []; // Reinicialización del arreglo de colores
    // Generación de nuevos colores aleatorios para cada elemento
    for (let i = 0; i < elementos.length; i++) {
        colores.push(colorAleatorio());
    }
    dibujar(); // Llamada a la función para dibujar la rueda
}

// Función para dibujar la rueda en el canvas
function dibujar() {
    ctx.clearRect(0, 0, ancho, alto); // Borrado del canvas
    ctx.beginPath();
    ctx.arc(centroX, centroY, radio, aRadianes(0), aRadianes(360));
    ctx.fillStyle = `rgb(33, 33, 33)`; // Color de fondo de la rueda
    ctx.lineTo(centroX, centroY);
    ctx.fill();

    let gradosInicio = gradosActuales;
    gradosElementos = {}; // Reiniciar los grados de los elementos
    
    for (let i = 0; i < elementos.length; i++) {
        let gradosFin = gradosInicio + paso;

        let color = colores[i];
        let estiloColor = `rgb(${color.r},${color.g},${color.b})`;

        ctx.beginPath();
        ctx.arc(centroX, centroY, radio - 2, aRadianes(gradosInicio), aRadianes(gradosFin));
        ctx.fillStyle = estiloColor;
        ctx.lineTo(centroX, centroY);
        ctx.fill();

        // Dibujar texto
        ctx.save();
        ctx.translate(centroX, centroY);
        ctx.rotate(aRadianes((gradosInicio + gradosFin) / 2));
        ctx.textAlign = "center";
        ctx.fillStyle = "#000"; // Color del texto (negro para mejor contraste)
        ctx.font = 'bold 30px Arial'; // Estilo del texto más grande
        // Posición del texto a una distancia adecuada del centro
        ctx.fillText(elementos[i], radio/2 + 20, 10);
        ctx.restore();

        // Almacenar los grados de inicio y fin de cada elemento
        gradosElementos[elementos[i]] = {
            "gradosInicio": gradosInicio,
            "gradosFin": gradosFin
        };

        // Verificar si el elemento está en la posición de ganador
        if ((gradosInicio % 360 <= 90 || gradosInicio % 360 >= 270) && 
            (gradosFin % 360 >= 270 || gradosFin % 360 <= 90)) {
            if (document.getElementById("ganador")) {
                document.getElementById("ganador").innerHTML = elementos[i];
            }
        }
        
        gradosInicio = gradosFin;
    }
}

// Inicializar la rueda
dibujar();

let velocidad = 0;
let rotacionMaxima = rangoAleatorio(360 * 3, 360 * 6);
let pausa = false;

function animar() {
    if (pausa) {
        return;
    }
    velocidad = easeOutSine(obtenerPorcentaje(gradosActuales, 0, rotacionMaxima)) * 20;
    if (velocidad < 0.01) {
        velocidad = 0;
        pausa = true;
        tacharGanador();
    }
    gradosActuales += velocidad;
    dibujar();
    window.requestAnimationFrame(animar);
}

function girar() {
    if (velocidad !== 0) {
        return;
    }

    elementos = document.getElementById("textarea").value.trim().split("\n").filter(e => e !== '' && !e.includes('~~'));
    
    if (elementos.length === 0) {
        alert("No hay elementos para girar. Por favor, agrega elementos a la lista.");
        return;
    }

    rotacionMaxima = rangoAleatorio(360 * 3, 360 * 6);
    gradosActuales = 0;
    crearRueda();
    dibujar();

    let ganador = elementos[Math.floor(Math.random() * elementos.length)];
    // Asegúrate de que gradosElementos tenga el ganador
    if (!gradosElementos[ganador]) {
        crearRueda();
    }
    
    pausa = false;
    window.requestAnimationFrame(animar);
}

function tacharGanador() {
    const elementoGanador = Object.keys(gradosElementos).find(elemento => {
        const grados = gradosElementos[elemento];
        return (grados.gradosInicio % 360 <= 90 || grados.gradosInicio % 360 >= 270) && 
               (grados.gradosFin % 360 >= 270 || grados.gradosFin % 360 <= 90);
    });

    if (elementoGanador && !tachados.has(elementoGanador)) {
        tachados.add(elementoGanador);
        let textarea = document.getElementById("textarea");
        let lines = textarea.value.split("\n");
        textarea.value = lines.map(line => line === elementoGanador ? `~~${line}~~` : line).join("\n");
        
        if (document.getElementById("ganador")) {
            document.getElementById("ganador").innerText = elementoGanador;
        }
        
        // Opcional: mostrar un mensaje con el ganador
        // alert(`¡El ganador es: ${elementoGanador}!`);
        
        crearRueda();  // Actualizar la rueda después de tachar al ganador
    }
}

function cambiarTitulo() {
    const nuevoTitulo = prompt("Ingrese el nuevo título:");
    if (nuevoTitulo) {
        document.title = nuevoTitulo;
        if (document.getElementById("titulo")) {
            document.getElementById("titulo").innerText = nuevoTitulo;
        }
    }
}

function editarElementos() {
    document.getElementById("textarea").style.display = "block";
}

function esconderElementos() {
    document.getElementById("textarea").style.display = "none";
}

function reiniciar() {
    if (document.getElementById("ganador")) {
        document.getElementById("ganador").innerText = "Girar la ruleta";
    }
    tachados.clear();
    let textarea = document.getElementById("textarea");
    let lines = textarea.value.split("\n");
    textarea.value = lines.map(line => line.replace(/~~/g, '')).join("\n");
    crearRueda();
}

function pantallaCompleta() {
    const contenedor = document.querySelector('.contenedor-principal');
    if (contenedor.requestFullscreen) {
        contenedor.requestFullscreen();
    } else if (contenedor.mozRequestFullScreen) {
        contenedor.mozRequestFullScreen();
    } else if (contenedor.webkitRequestFullscreen) {
        contenedor.webkitRequestFullscreen();
    } else if (contenedor.msRequestFullscreen) {
        contenedor.msRequestFullscreen();
    }
}

// Agregamos los eventos de teclado
document.addEventListener('keydown', function(event) {
    switch (event.key.toUpperCase()) {
        case ' ':
        case 'SPACE':
            girar();
            break;
        case 'S':
            tacharGanador();
            break;
        case 'R':
            reiniciar();
            break;
        case 'E':
            editarElementos();
            break;
        case 'F':
            pantallaCompleta();
            break;
    }
});