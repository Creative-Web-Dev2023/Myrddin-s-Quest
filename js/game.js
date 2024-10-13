let canvas;
let world;
let keyboard = new Keyboard();


function startGame() {
  document.querySelector('.overlay').style.display = 'none'; // Blende das Overlay a
}

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas , keyboard);
  

}

window.addEventListener("keydown", (e) => {
  //wenn eine Taste gedrückt wird)
  if (e.keyCode ==39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode  == 37) {
    keyboard.LEFT = true;
  }
  
  if (e.keyCode  == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
});

window.addEventListener("keyup", (e) => { // wenn eine Taste losgelassen wird
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
