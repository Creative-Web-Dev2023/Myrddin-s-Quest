let canvas;
let ctx;
let keyboard = new Keyboard();
let world;
let candleImage = new Image();
let IntervallIDs = [];
let gameLoopInterval;
let knightHealthDisplay;
let endGame;
let activeIntervals = [];

function stopAllIntervals() {
  activeIntervals.forEach(clearInterval);
  activeIntervals = [];
}

function startGame() {
  localStorage.setItem("deaths", JSON.stringify(0));
  document.querySelector(".overlay").style.display = "none";
  document.getElementById("audioSwitcher").classList.remove("hidden");
  document.getElementById("bigScreen").classList.remove("hidden");
  document.getElementById("key-info").classList.add("show");
  document.addEventListener("DOMContentLoaded", (event) => {});
  initLevel();
  init();
}

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  world = new World(canvas, keyboard);
  endGame = new EndGame(world);
  playLevel1Sound();
  setupTouchControls();
  if (!Array.isArray(activeIntervals)) {
    activeIntervals = [];
  }
  startGameLoop();
  document.getElementById("tryAgain").addEventListener("click", () => {
    endGame.resumeGame();
  });
  document.getElementById("quitButton").addEventListener("click", quitGame);
}

function startGameLoop() {
  if (!world) return;
  stopAllIntervals();
  function gameLoop() {
    world.update();
    world.draw();
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
}

function setupTouchControls() {
  setupTouchControl("btn-left", "LEFT");
  setupTouchControl("btn-right", "RIGHT");
  setupTouchControl("btn-jump", "JUMP");
  setupTouchControl("btn-attack", "ATTACK");
  setupTouchControl("btn-throw", "D");
}

function setupTouchControl(buttonId, key) {
  document
    .getElementById(buttonId)
    .addEventListener("touchstart", () => (keyboard[key] = true), {
      passive: true,
    });
  document
    .getElementById(buttonId)
    .addEventListener("touchend", () => (keyboard[key] = false), {
      passive: true,
    });
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
  stopAllIntervals();
  endGame.resumeGame();
  setTimeout(() => {
    startGameLoop();
  }, 100);
}

function toggleFullscreen() {
  const canvas = document.getElementById("canvas");
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {});
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
  }
});

function checkOrientation() {
  const rotateDiv = document.getElementById("rotate");

  if (window.innerWidth < 768 && window.innerHeight > window.innerWidth) {
    rotateDiv.style.display = "flex";
  } else {
    rotateDiv.style.display = "none";
  }
}
window.addEventListener("resize", checkOrientation);
document.addEventListener("DOMContentLoaded", checkOrientation);
