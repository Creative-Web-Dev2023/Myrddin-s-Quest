let canvas;
let ctx;
let keyboard = new Keyboard();
let world;
let candleImage = new Image();
let IntervallIDs = [];
let knightHealthDisplay;

const gameState = {
  save() {
    if (
      typeof world !== "undefined" &&
      typeof world.character !== "undefined"
    ) {
      localStorage.setItem(
        "gameState",
        JSON.stringify({
          characterX: world.character.x,
          characterY: world.character.y,
          characterEnergy: world.character.energy,
          enemies: world.enemies.map((e) => ({
            type: e.constructor.name,
            x: e.x,
            y: e.y,
            energy: e.energy,
            dead: e.dead,
          })),
          levelProgress: world.character.x,
        })
      );
    }
  },

  restore() {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) return;
    this.restoreCharacter(saved);
    this.restoreEnemies(saved);
    world.camera_x = saved.levelProgress;
  },

  restoreCharacter(saved) {
    world.character.x = saved.characterX;
    world.character.y = saved.characterY;
    world.character.energy = 100;
    world.character.deadAnimationPlayed = false;
    world.character.isVisible = true;
    world.character.invincible = true;
    setTimeout(() => {
      world.character.invincible = false;
    }, 3000);
  },

  restoreEnemies(saved) {
    world.enemies = saved.enemies.map((data) => {
      let enemy = world.enemies.find((e) => e.x === data.x && e.y === data.y);
      if (!enemy) {
        if (data.type === "Endboss") {
          enemy = new Endboss();
        } else if (data.type === "Knight") {
          enemy = new Knight();
        } else if (data.type === "Snake") {
          enemy = new Snake();
        } else {
          enemy = new Enemy();
        }
      }
      enemy.x = data.x;
      enemy.y = data.y;
      enemy.energy = data.energy;
      enemy.dead = data.dead;
      enemy.isVisible = !data.dead;
      enemy.canAttack = false;
      setTimeout(() => {
        enemy.canAttack = true;
      }, 3000);
      return enemy;
    });
  },
};

function startGame() {
  document.querySelector(".overlay").style.display = "none";
  document.getElementById("audioSwitcher").classList.remove("hidden");
  document.getElementById("bigScreen").classList.remove("hidden");
  document.getElementById("key-info").classList.add("show");
  document.addEventListener("DOMContentLoaded", (event) => {});
  document
    .getElementById("audioSwitcher")
    .setAttribute("onclick", "musicSwitcher()");
  init();
}

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  world = new World(canvas, keyboard);
  playLevel1Sound();
  gameLoop();
  setupTouchControls(); 
  document.getElementById("tryAgain").addEventListener("click", tryAgain);
  document.getElementById("quitButton").addEventListener("click", quitGame);
}

function setupTouchControls() {
  setupTouchControl("btn-left", "LEFT");
  setupTouchControl("btn-right", "RIGHT");
  setupTouchControl("btn-jump", "JUMP");
  setupTouchControl("btn-attack", "ATTACK");
  setupTouchControl("btn-throw", "D");
}

function setupTouchControl(buttonId, key) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener(
      "touchstart",
      () => {
        keyboard[key] = true;
      },
      { passive: true }
    );
    button.addEventListener(
      "touchend",
      () => {
        keyboard[key] = false;
      },
      { passive: true }
    );
  }
}

function gameLoop() {
  world.update();
  world.draw();
  world.collisionHandler.checkThrowableObject(); 
  world.gameLoop.loopID = requestAnimationFrame(gameLoop);
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
  if (world.gameLoop.running) {
    world.gameLoop.stop();
  }
  setTimeout(() => {
    gameState.restore();
    document.getElementById("game-over-container").style.display = "none";
    world.characterStatusBar.setPercentage(world.character.energy);
    world.character.resetState();
    if (!world.gameLoop.running) {
      world.gameLoop.start();
    }
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
