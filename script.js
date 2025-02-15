let secuencia = [];
let ronda = 0;
let jugando = false;
let nombreJugador = "";
const colores = ["verde", "rojo", "azul", "amarillo"];
const sonidos = {
  verde: new Audio("sounds/green.mp3"),
  rojo: new Audio("sounds/red.mp3"),
  azul: new Audio("sounds/blue.mp3"),
  amarillo: new Audio("sounds/yellow.mp3"),
};

const menuContainer = document.getElementById("menu");
const juegoContainer = document.getElementById("juego");
const mensajeTerminado = document.getElementById("mensaje-terminado");
const tablaBody = document.getElementById("tabla-body");
const puntuador = document.getElementById("puntuador");
const nombreInput = document.getElementById("nombre-jugador");
const botonJugar = document.getElementById("jugar");
const botonReiniciar = document.getElementById("reiniciar");
const botonPuntuaciones = document.getElementById("puntuaciones");
const botonCerrarTabla = document.getElementById("cerrar-tabla");

nombreInput.addEventListener("input", () => {
  botonJugar.disabled = !nombreInput.value.trim();
});

botonJugar.addEventListener("click", iniciarJuego);
botonReiniciar.addEventListener("click", reiniciarJuego);

function iniciarJuego() {
  nombreJugador = nombreInput.value.trim();
  menuContainer.style.display = "none";
  juegoContainer.style.display = "block";
  jugando = true;
  ronda = 0;
  secuencia = [];
  puntuador.textContent = "0";
  siguienteRonda();
}

function siguienteRonda() {
  ronda++;
  puntuador.textContent = ronda;
  secuencia.push(colores[Math.floor(Math.random() * 4)]);
  console.log("Secuencia actual:", secuencia);
  reproducirSecuencia();
}
function reproducirSecuencia() {
  let i = 0;
  const intervalo = setInterval(() => {
    if (i >= secuencia.length) {
      clearInterval(intervalo);
      return;
    }
    iluminarBoton(secuencia[i]);
    i++;
  }, 1000);
}

function iluminarBoton(color) {
  const boton = document.getElementById(color);
  boton.classList.add("iluminado");
  sonidos[color].play();
  setTimeout(() => {
    boton.classList.remove("iluminado");
  }, 500);
}
let indiceSecuenciaJugador = 0;
document.querySelectorAll(".simon-button").forEach((boton) => {
  boton.addEventListener("click", (e) => {
    if (!jugando) return;
    const color = e.target.id;
    iluminarBoton(color);

    if (color !== secuencia[indiceSecuenciaJugador]) {
      terminarJuego();
    } else {
      indiceSecuenciaJugador++;
      if (indiceSecuenciaJugador === secuencia.length) {
        indiceSecuenciaJugador = 0;
        setTimeout(siguienteRonda, 1000);
      }
    }
  });
});
function terminarJuego() {
  jugando = false;
  juegoContainer.style.display = "none";
  mensajeTerminado.style.display = "block";
  document.getElementById("mensaje-puntaje").textContent = `Ronda alcanzada: ${
    ronda - 1
  }`;
}
function reiniciarJuego() {
  mensajeTerminado.style.display = "none";
  menuContainer.style.display = "block";
}
