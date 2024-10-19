let canvas;
let world;
let keyboard = new Keyboard();
let candleImage = new Image(); // Erstelle das Bild-Objekt

function startGame() {
  document.querySelector(".overlay").style.display = "none"; // Blende das Overlay an
  document.getElementById("audioSwitcher").classList.remove("hidden");
  document
    .getElementById("audioSwitcher")
    .setAttribute("onclick", "musicSwitcher()");
  init();
}

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  
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
  description.classList.remove("show");
  description.classList.add("hidden");

}


window.addEventListener("keydown", (e) => {
  //wenn eine Taste gedrückt wird)
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
});

window.addEventListener("keyup", (e) => {
  // wenn eine Taste losgelassen wird
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
});