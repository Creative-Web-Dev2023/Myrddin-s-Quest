let canvas;
let keyboard = new Keyboard();
let world;
let candleImage = new Image(); // Erstelle das Bild-Objekt
let IntervallIDs = [];

function startGame() {
  document.querySelector(".overlay").style.display = "none"; // Blende das Overlay aus
  document.getElementById("audioSwitcher").classList.remove("hidden");
  document.getElementById("infoButton").classList.remove("hidden"); // Show the info icon
  document.getElementById("bigScreen").classList.remove("hidden"); // Show the fullscreen icon
  document
    .getElementById("audioSwitcher")
    .setAttribute("onclick", "musicSwitcher()");
  init();
}

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard); // Stelle sicher, dass World definiert ist
  gameLoop();
}

function gameLoop() {
  world.update(); // Kollisionsprüfungen und andere Updates
  world.draw(); // Zeichne alle Objekte, einschließlich Charakter und Münzen
  requestAnimationFrame(gameLoop); // Fordere den nächsten Frame an
}

function handleDescription() {
  let description = document.getElementById("description");
  console.log(description); // Gibt das Element aus, um sicherzustellen, dass es existiert
  if (description.classList.contains("hidden")) {
    description.classList.remove("hidden");
    description.classList.add("show");
  } else {
    description.classList.remove("show");
    description.classList.add("hidden");
  }
}

function goBack() {
  let description = document.getElementById("description");
  let impressum = document.getElementById("impressum");
  description.classList.add("hidden"); // Beschreibung und Impressum ausblenden und das Overlay zeigen
  description.classList.remove("show");
  impressum.classList.add("hidden");
  impressum.classList.remove("show");
}

function quitGame() {
  location.reload(); // Seite neu laden, um das Spiel neu zu starten
}

function tryAgain() {
  location.reload(); // Seite neu laden, um das Spiel neu zu starten
}

function toggleInfoBox() {

  let description = document.getElementById("description");
  if (description.classList.contains("hidden")) {
    description.classList.remove("hidden");
    description.classList.add("show");
  } else {
    description.classList.remove("show");
    description.classList.add("hidden");
  }
}

function toggleFullscreen() {
  const canvas = document.getElementById("canvas");
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

// Event Listener für Tastendrücke

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 87) {
    keyboard.JUMP = true;
  }
  if (e.code === "KeyA") {
    keyboard.ATTACK = true; // Angriffstaste
  }
  if (e.code === "KeyS") {
    keyboard.THROW = true; // Feueranimationstaste
  }
  if (e.code === "KeyD") {
    keyboard.D = true; // D-Taste
    world.character.throwObject(); // Call character method  JUMP
  }
});

// Event Listener für das Loslassen der Tasten
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 87
    
  ) {
    keyboard.JUMP = false;
  }
  if (e.code === "KeyA") {
    keyboard.ATTACK = false; // Angriffstaste loslassen
  }
  if (e.code === "KeyS") {
    keyboard.THROW = false; // Feueranimationstaste loslassen
  }
  if (e.code === "KeyD") {
    keyboard.D = false; // D-Taste loslassen
  }
});

// Füge einen Event Listener für den Start-Button hinzu
window.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.addEventListener("click", startGame);
  } else {
    console.error("Element mit ID 'startButton' nicht gefunden.");
  }
});

function handleImpressum() {
  let impressum = document.getElementById("impressum");
  impressum.classList.toggle("hidden");
  impressum.classList.toggle("show");
}

// Füge einen Event Listener für den Info-Button hinzu
window.addEventListener("DOMContentLoaded", () => {
  const infoButton = document.getElementById("infoButton");
  if (infoButton) {
    infoButton.addEventListener("click", toggleInfoBox);
  } else {
    console.error("Element mit ID 'infoButton' nicht gefunden.");
  }
});

// Füge einen Event Listener für den Fullscreen-Button hinzu
window.addEventListener("DOMContentLoaded", () => {
  const bigScreenButton = document.getElementById("bigScreen");
  if (bigScreenButton) {
    bigScreenButton.addEventListener("click", () => {
      toggleFullscreen();
    });
  } else {
    console.error("Element mit ID 'bigScreen' nicht gefunden.");
  }
});

