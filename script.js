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
const tablaPuntajes = document.getElementById("tabla-puntajes");
const tablaBody = document.getElementById("tabla-body");
const puntuador = document.getElementById("puntuador");
const nombreInput = document.getElementById("nombre-jugador");
const botonJugar = document.getElementById("jugar");
const botonReiniciar = document.getElementById("reiniciar");
const botonPuntuaciones = document.getElementById("puntuaciones");
const botonCerrarTabla = document.getElementById("cerrar-tabla");
const botonVolverMenuJuego = document.getElementById("volver-menu-juego");
const botonVolverMenuTerminado = document.getElementById(
  "volver-menu-terminado"
);

nombreInput.addEventListener("input", () => {
  botonJugar.disabled = !nombreInput.value.trim();
});

botonJugar.addEventListener("click", iniciarJuego);
botonReiniciar.addEventListener("click", reiniciarJuego);
botonPuntuaciones.addEventListener("click", mostrarPuntajes);
botonCerrarTabla.addEventListener("click", () => {
  tablaPuntajes.style.display = "none";
});

function iniciarJuego() {
  nombreJugador = nombreInput.value.trim();
  menuContainer.style.display = "none";

  const gameContainer = document.getElementById("game-container");
  gameContainer.style.display = "block";

  const nombreDisplay = document.getElementById("nombre-display");
  nombreDisplay.textContent = nombreJugador;

  juegoContainer.style.display = "block";
  botonVolverMenuJuego.style.display = "block";

  jugando = true;
  ronda = 0;
  secuencia = [];
  puntuador.textContent = "0";
  siguienteRonda();
}

const botonComoJugar = document.getElementById("como-jugar");
const modalComoJugar = document.getElementById("como-jugar-modal");
const botonCerrarComoJugar = document.getElementById("cerrar-como-jugar");

botonComoJugar.addEventListener("click", () => {
  modalComoJugar.style.display = "flex";
});

botonCerrarComoJugar.addEventListener("click", () => {
  modalComoJugar.style.display = "none";
});

modalComoJugar.addEventListener("click", (e) => {
  if (e.target === modalComoJugar) {
    modalComoJugar.style.display = "none";
  }
});

botonVolverMenuJuego.addEventListener("click", () => {
  if (
    confirm(
      "Se dará por terminado este intento y se guardará con ese último puntaje. ¿Deseas continuar?"
    )
  ) {
    volverAlMenu();
  }
});

botonVolverMenuTerminado.addEventListener("click", volverAlMenu);

function siguienteRonda() {
  ronda++;
  puntuador.textContent = ronda;
  secuencia.push(colores[Math.floor(Math.random() * 4)]);
  console.log("Secuencia actual:", secuencia);
  reproducirSecuencia();
}

function volverAlMenu() {
  cambiarFondo("#ffffff");

  guardarPuntaje(nombreJugador, ronda - 1);

  jugando = false;

  document.getElementById("game-container").style.display = "none";
  mensajeTerminado.style.display = "none";
  menuContainer.style.display = "block";
}

function iluminarBoton(color) {
  const boton = document.getElementById(color);
  boton.classList.add("iluminado", "resplandor");
  Object.values(sonidos).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  sonidos[color].play();
  setTimeout(() => {
    boton.classList.remove("iluminado", "resplandor");
  }, 500);
}

function deshabilitarBotones() {
  document.querySelectorAll(".simon-button").forEach((boton) => {
    boton.disabled = true;
  });
}

function habilitarBotones() {
  document.querySelectorAll(".simon-button").forEach((boton) => {
    boton.disabled = false;
  });
}

let indiceSecuenciaJugador = 0;
document.querySelectorAll(".simon-button").forEach((boton) => {
  boton.addEventListener("click", (e) => {
    if (!jugando || boton.disabled) return;
    const color = e.target.id;
    console.log("Botón clickeado:", color);
    console.log(
      "Comparando con secuencia en índice",
      indiceSecuenciaJugador,
      "->",
      secuencia[indiceSecuenciaJugador]
    );
    iluminarBoton(color);

    if (color !== secuencia[indiceSecuenciaJugador]) {
      console.log(
        "Error: color clickeado",
        color,
        "no coincide con",
        secuencia[indiceSecuenciaJugador]
      );

      terminarJuego();
    } else {
      console.log("Acertaste el color", color);
      indiceSecuenciaJugador++;
      if (indiceSecuenciaJugador === secuencia.length) {
        console.log("Secuencia completada correctamente.");
        indiceSecuenciaJugador = 0;
        deshabilitarBotones();
        setTimeout(siguienteRonda, 1000);
      }
    }
  });
});

function cambiarFondo(color) {
  document.body.style.backgroundColor = color;
}

function reproducirSecuencia() {
  cambiarFondo("#b0b0b0");
  deshabilitarBotones();
  let i = 0;
  const intervalo = setInterval(() => {
    if (i >= secuencia.length) {
      clearInterval(intervalo);
      habilitarBotones();
      cambiarFondo("#f0f0f0");
      return;
    }
    iluminarBoton(secuencia[i]);
    i++;
  }, 1000);
}

function terminarJuego() {
  jugando = false;
  juegoContainer.style.display = "none";

  document.body.style.backgroundColor = "red";
  setTimeout(() => {
    document.body.style.backgroundColor = "#ff3333";
  }, 300);

  mensajeTerminado.style.display = "block";
  document.getElementById("mensaje-puntaje").textContent = `Ronda alcanzada: ${
    ronda - 1
  }`;
  guardarPuntaje(nombreJugador, ronda - 1);
}

function reiniciarJuego() {
  mensajeTerminado.style.display = "none";
  secuencia = [];
  ronda = 1;
  jugando = true;
  indiceSecuenciaJugador = 0;
  juegoContainer.style.display = "block";
  cambiarFondo("#f0f0f0");
  iniciarJuego();
}

function guardarPuntaje(nombre, puntaje) {
  const puntajes = JSON.parse(localStorage.getItem("puntajes")) || [];
  puntajes.push({ nombre, puntaje });
  puntajes.sort((a, b) => b.puntaje - a.puntaje);
  localStorage.setItem("puntajes", JSON.stringify(puntajes));
}

function mostrarPuntajes() {
  const puntajes = JSON.parse(localStorage.getItem("puntajes")) || [];
  puntajes.sort((a, b) => b.puntaje - a.puntaje);
  const top10 = puntajes.slice(0, 10);
  tablaBody.innerHTML = "";
  top10.forEach((puntaje, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${index + 1}</td><td>${puntaje.nombre}</td><td>${
      puntaje.puntaje
    }</td>`;
    tablaBody.appendChild(fila);
  });
  tablaPuntajes.style.display = "block";
}
