document.addEventListener('keydown', (event) => {
  console.log(`Key pressed: ${event.key}, Key code: ${event.keyCode}`);
  // ...existing code...
  if (event.keyCode === 68) keyboard.D = true; // D-Taste
});

document.addEventListener('keyup', (event) => {
  // ...existing code...
  if (event.keyCode === 68) keyboard.D = false; // D-Taste
});

// Beispiel für die Initialisierung des Spiels
function init() {
  const canvas = document.getElementById('canvas');
  const keyboard = new Keyboard();
  const world = new World(canvas, keyboard);
  // ...existing code...
}

// Beispiel für die Keyboard-Initialisierung
function Keyboard() {
  this.LEFT = false;
  this.RIGHT = false;
  this.UP = false;
  this.DOWN = false;
  this.SPACE = false;
  this.THROW = false;
  this.ATTACK = false;
  this.D = false;

  document.addEventListener('keydown', (event) => {
    if (event.keyCode === 37) this.LEFT = true;
    if (event.keyCode === 39) this.RIGHT = true;
    if (event.keyCode === 38) this.UP = true;
    if (event.keyCode === 40) this.DOWN = true;
    if (event.keyCode === 32) this.SPACE = true;
    if (event.keyCode === 84) this.THROW = true; // T-Taste
    if (event.keyCode === 65) this.ATTACK = true; // A-Taste
    if (event.keyCode === 68) this.D = true; // D-Taste
  });

  document.addEventListener('keyup', (event) => {
    if (event.keyCode === 37) this.LEFT = false;
    if (event.keyCode === 39) this.RIGHT = false;
    if (event.keyCode === 38) this.UP = false;
    if (event.keyCode === 40) this.DOWN = false;
    if (event.keyCode === 32) this.SPACE = false;
    if (event.keyCode === 84) this.THROW = false; // T-Taste
    if (event.keyCode === 65) this.ATTACK = false; // A-Taste
    if (event.keyCode === 68) this.D = false; // D-Taste
  });
}

// Initialisieren Sie das Spiel
window.addEventListener('load', init);
