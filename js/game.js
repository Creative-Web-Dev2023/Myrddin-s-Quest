let canvas;
let ctx;
let keyboard = new Keyboard();
let world;
let candleImage = new Image();
let IntervallIDs = [];
let knightHealthDisplay;

function startGame() {
  document.querySelector(".overlay").style.display = "none";
  document.getElementById("audioSwitcher").classList.remove("hidden");
  document.getElementById("bigScreen").classList.remove("hidden");
  document.getElementById('key-info').classList.add('show');
  document.addEventListener('DOMContentLoaded', (event) => {});
  document.getElementById("audioSwitcher").setAttribute("onclick", "musicSwitcher()");
  init();
}

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  world = new World(canvas, keyboard);
  playLevel1Sound();
  gameLoop();

  // Event-Listener für die Steuerungselemente
  document.getElementById('btn-left').addEventListener('touchstart', () => keyboard.LEFT = true, { passive: true });
  document.getElementById('btn-left').addEventListener('touchend', () => keyboard.LEFT = false, { passive: true });

  document.getElementById('btn-right').addEventListener('touchstart', () => keyboard.RIGHT = true, { passive: true });
  document.getElementById('btn-right').addEventListener('touchend', () => keyboard.RIGHT = false, { passive: true });

  document.getElementById('btn-jump').addEventListener('touchstart', () => keyboard.JUMP = true, { passive: true });
  document.getElementById('btn-jump').addEventListener('touchend', () => keyboard.JUMP = false, { passive: true });

  document.getElementById('btn-attack').addEventListener('touchstart', () => keyboard.ATTACK = true, { passive: true });
  document.getElementById('btn-attack').addEventListener('touchend', () => keyboard.ATTACK = false, { passive: true });

  document.getElementById('btn-throw').addEventListener('touchstart', () => keyboard.D = true, { passive: true });
  document.getElementById('btn-throw').addEventListener('touchend', () => keyboard.D = false, { passive: true });
}

function gameLoop() {
  world.update();
  world.draw();
  requestAnimationFrame(gameLoop);
}

function handleDescription() {
  let description = document.getElementById("description");
  console.log(description);
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
  description.classList.add("hidden");
  description.classList.remove("show");
  impressum.classList.add("hidden");
  impressum.classList.remove("show");
}

function quitGame() {
  location.reload();
}

function tryAgain() {
  location.reload();
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
    keyboard.ATTACK = true;
  }
  if (e.keyCode === 68) {
    keyboard.D = true;
    if (world && world.collisionHandler) {
      world.collisionHandler.checkThrowableObject();
    }
  }
});

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
  if (e.keyCode == 87) {
    keyboard.JUMP = false;
  }
  if (e.code === "KeyA") {
    keyboard.ATTACK = false;
  }
  if (e.keyCode === 68) {
    keyboard.D = false;
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.addEventListener("click", startGame);
  } else {
    console.error("Element with ID 'startButton' not found.");
  }
});

function handleImpressum() {
  let impressum = document.getElementById("impressum");
  impressum.classList.toggle("hidden");
  impressum.classList.toggle("show");
}

window.addEventListener("DOMContentLoaded", () => {
  const bigScreenButton = document.getElementById("bigScreen");
  if (bigScreenButton) {
    bigScreenButton.addEventListener("click", () => {
      toggleFullscreen();
    });
  } else {
    console.error("Element with ID 'bigScreen' not found.");
  }
});

function checkOrientation() {
  const rotateDiv = document.getElementById('rotate');
  if (window.innerWidth < 720 && window.innerHeight > window.innerWidth) {
    rotateDiv.style.display = 'flex';
  } else {
    rotateDiv.style.display = 'none';
  }
}

window.addEventListener('orientationchange', checkOrientation);
window.addEventListener('resize', checkOrientation);
