let canvas;
let keyboard = new Keyboard();
let world;
let candleImage = new Image(); // Erstelle das Bild-Objekt
let IntervallIDs = [];

function startGame() {
    document.querySelector(".overlay").style.display = "none"; // Blende das Overlay aus
    document.getElementById("audioSwitcher").classList.remove("hidden");
    document.getElementById("audioSwitcher").setAttribute("onclick", "musicSwitcher()");
    init();
}

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    gameLoop();
}

function gameLoop() {
    world.update(); // Kollisionsprüfungen und andere Updates
    world.draw(); // Zeichne alle Objekte, einschließlich Charakter und Münzen
    requestAnimationFrame(gameLoop); // Fordere den nächsten Frame an
}

function handleDescription() {
  let description = document.getElementById("description");
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
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.code === "KeyA") {
    keyboard.ATTACK = true; // Angriffstaste
  }
  if (e.code === "KeyT") {
    keyboard.THROW = true; // Feueranimationstaste
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
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.code === "KeyA") {
    keyboard.ATTACK = false; // Angriffstaste loslassen
  }
  if (e.code === "KeyT") {
    keyboard.THROW = false; // Feueranimationstaste loslassen
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
