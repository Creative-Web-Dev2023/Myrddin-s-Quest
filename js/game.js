let canvas;
let ctx;
let keyboard = new Keyboard();
let world;
let IntervallIDs = [];

const gameState = {
  save() {
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
  },

  restore() {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) return;
    this.restoreCharacter(saved);
    this.restoreEnemies(saved);
    world.camera_x = saved.levelProgress;
  },

  restoreCharacter(saved) {
    Object.assign(world.character, {
      x: saved.characterX,
      y: saved.characterY,
      energy: 100,
      deadAnimationPlayed: false,
      isVisible: true,
      invincible: true,
    });
    setTimeout(() => (world.character.invincible = false), 3000);
  },

  restoreEnemies(saved) {
    world.enemies =
      saved.enemies?.map((data) => {
        let enemy = new (window[data.type] || Enemy)();
        Object.assign(enemy, data, { isVisible: !data.dead, canAttack: false });
        setTimeout(() => (enemy.canAttack = true), 3000);
        return enemy;
      }) || [];
  },
};

function startGame() {
  document.querySelector(".overlay").style.display = "none";
  document.getElementById("audioSwitcher").classList.remove("hidden");
  document.getElementById("bigScreen").classList.remove("hidden");
  document.getElementById("key-info").classList.add("show");
  document.getElementById("audioSwitcher").onclick = musicSwitcher;
  init();
}

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  world = new World(canvas, keyboard);
  gameLoop();
  setupTouchControls();
  setupKeyboardControls();
  document.getElementById("tryAgain").addEventListener("click", tryAgain);
  document.getElementById("quitButton").addEventListener("click", quitGame);
}

function setupKeyboardControls() {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        keyboard.LEFT = true;
        break;
      case "ArrowRight":
        keyboard.RIGHT = true;
        break;
      case "w":
      case "W":
        keyboard.JUMP = true;
        break;
      case "a":
      case "A":
        keyboard.ATTACK = true;
        break;
      case "d":
      case "D":
        keyboard.D = true;
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        keyboard.LEFT = false;
        break;
      case "ArrowRight":
        keyboard.RIGHT = false;
        break;
      case "w":
      case "W":
        keyboard.JUMP = false;
        break;
      case "a":
      case "A":
        keyboard.ATTACK = false;
        break;
      case "d":
      case "D":
        keyboard.D = false;
        break;
    }
  });
}

function gameLoop() {
  world.update();
  world.draw();
  world.loopID = requestAnimationFrame(gameLoop);
}

function tryAgain() {
  clearAllIntervals();
  setTimeout(() => world.endGame.resumeGame(), 100);
}


function clearAllIntervals() {
  IntervallIDs.forEach(clearInterval);
  IntervallIDs = [];
}

function quitGame() {
  location.reload();
}

function toggleFullscreen() {
  const container = document.getElementById("canvas-container");
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

function setupTouchControls() {
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  document.getElementById("controls").style.display = isTouchDevice
    ? "flex"
    : "none";

  if (isTouchDevice) {
    ["btn-left", "btn-right", "btn-jump", "btn-attack", "btn-throw"].forEach((id) => {
        const button = document.getElementById(id);
        if (button) {
          const key = id.toUpperCase().replace("BTN-", "");
          button.addEventListener("touchstart", () => (keyboard[key] = true));
          button.addEventListener("touchend", () => (keyboard[key] = false));
        }
      }
    );
  }
}

function handleImpressum() {
  let impressum = document.getElementById("impressum");
  impressum.classList.toggle("hidden");
  impressum.classList.toggle("show");
}

function handleDescription() {
  const description = document.getElementById("description");
  const impressumContainer = document.getElementById("impressum-container");
  description.classList.toggle("hidden");
  description.classList.toggle("show");
  impressumContainer.style.display = description.classList.contains("show")
    ? "none"
    : "block";
}

function goBack() {
  let description = document.getElementById("description");
  let impressum = document.getElementById("impressum");
  description.classList.add("hidden");
  description.classList.remove("show");
  impressum.classList.add("hidden");
  impressum.classList.remove("show");
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
