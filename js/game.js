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
  document.getElementById("tryAgain").addEventListener("click", tryAgain);
  document.getElementById("quitButton").addEventListener("click", quitGame);
  updateResponsive();
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

function updateResponsive() {
  document.getElementById("controls").style.display = checkTouchDevice()
    ? "flex"
    : "none";
}

function checkTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function setupTouchControls() {
  const controls = document.getElementById("controls");
  if (checkTouchDevice()) {
    controls.style.display = "flex";
    setupTouchControl("btn-left", "LEFT");
    setupTouchControl("btn-right", "RIGHT");
    setupTouchControl("btn-jump", "JUMP");
    setupTouchControl("btn-attack", "ATTACK");
    setupTouchControl("btn-throw", "D");
  } else {
    controls.style.display = "none";
  }
}

function setupTouchControl(buttonId, key) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  button.addEventListener("touchstart", () => (keyboard[key] = true), {
    passive: true,
  });
  button.addEventListener("touchend", () => (keyboard[key] = false), {
    passive: true,
  });
}

function handleImpressum() {
  let impressum = document.getElementById("impressum");
  impressum.classList.toggle("hidden");
  impressum.classList.toggle("show");
}

function handleDescription() {
  let description = document.getElementById("description");
  description.classList.toggle("hidden");
  description.classList.toggle("show");
}

function goBack() {
  let description = document.getElementById("description");
  let impressum = document.getElementById("impressum");
  description.classList.add("hidden");
  description.classList.remove("show");
  impressum.classList.add("hidden");
  impressum.classList.remove("show");
}

window.addEventListener("resize", updateResponsive);
document.addEventListener("DOMContentLoaded", () => {
  init();
  setTimeout(updateResponsive, 100);
});
