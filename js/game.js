let canvas;
let ctx;
let keyboard = new Keyboard();
let world;
let IntervallIDs = [];
let loopId = null;

/**
 * The gameState object handles saving and restoring the game state using localStorage.
 */
const gameState = {
  /**
   * Saves the current game state to localStorage.
   * The saved state includes the character's position, energy, and the state of all enemies.
   */
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

  /**
   * Restores the game state from localStorage.
   * If no saved state is found, the function returns early.
   * Restores the character and enemies to their saved states and updates the camera position.
   */
  restore() {
    const saved = JSON.parse(localStorage.getItem("gameState"));
    if (!saved) return;
    this.restoreCharacter(saved);
    this.restoreEnemies(saved);
    world.camera_x = saved.levelProgress;
  },

  /**
   * Restores the character's state from the saved data.
   * Sets the character's position, energy, and other properties.
   * Makes the character invincible for 3 seconds after restoration.
   *
   * @param {Object} saved - The saved game state.
   */
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

  /**
   * Restores the enemies' states from the saved data.
   * Creates new enemy instances based on the saved data and sets their properties.
   * Makes the enemies unable to attack for 3 seconds after restoration.
   *
   * @param {Object} saved - The saved game state.
   */
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

/**
 * Starts the game by hiding the overlay, showing the audio and fullscreen controls,
 * and initializing the game.
 */
function startGame() {
  document.querySelector(".overlay").style.display = "none";
  document.getElementById("audioSwitcher").classList.remove("hidden");
  document.getElementById("bigScreen").classList.remove("hidden");
  document.getElementById("key-info").classList.add("show");
  document.getElementById("audioSwitcher").onclick = musicSwitcher;
  initializeMusicSettings();
  init();
 
}

/**
 * Initializes the game by setting up the canvas, creating the world, starting the game loop,
 * setting up touch and keyboard controls, and adding event listeners for the try again and quit buttons.
 */
function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  world = new World(canvas, keyboard);
  keyboard.setupControls(world);
  keyboard.setupTouchControls(world);
  gameLoop();
  document.getElementById("tryAgain").addEventListener("click", tryAgain);
  document.getElementById("quitButton").addEventListener("click", quitGame);
}

/**
 * The main game loop function that updates and draws the game world.
 * It uses requestAnimationFrame to continuously call itself, creating a loop.
 */
function gameLoop() {
  if (world.loopID) cancelAnimationFrame(world.loopID);
  world.update();
  world.draw();
  world.loopID = requestAnimationFrame(gameLoop);
}

/**
 * Tries to resume the game after the character dies.
 * Clears all intervals and resumes the game after a short delay.
 */
function tryAgain() {
  clearAllIntervals();
  setTimeout(() => world.endGame.resumeGame(), 100);
}

/**
 * Clears all intervals stored in the IntervallIDs array.
 */
function clearAllIntervals() {
  IntervallIDs.forEach(clearInterval);
  IntervallIDs = [];
}

/**
 * Quits the game by reloading the page.
 */
function quitGame() {
  location.reload();
}

/**
 * Toggles the fullscreen mode for the element with the ID "canvas-container".
 * If the document is not currently in fullscreen mode, it requests fullscreen for the container.
 * If the document is already in fullscreen mode, it exits fullscreen.
 */
function toggleFullscreen() {
  const container = document.getElementById("canvas-container");
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

/**
 * Toggles the visibility of the impressum section.
 */
function handleImpressum() {
  let impressum = document.getElementById("impressum");
  impressum.classList.toggle("hidden");
  impressum.classList.toggle("show");
}

/**
 * Toggles the visibility of the description section and hides the impressum container if the description is shown.
 */
function handleDescription() {
  const description = document.getElementById("description");
  const impressumContainer = document.getElementById("impressum-container");
  description.classList.toggle("hidden");
  description.classList.toggle("show");
  impressumContainer.style.display = description.classList.contains("show")
    ? "none"
    : "block";
  if (description.classList.contains("show")) {
    document.body.style.overflow = "auto";
  } else {
    document.body.style.overflow = "hidden";
  }
}

/**
 * Hides the description and impressum sections and shows the start screen.
 */
function goBack() {
  let description = document.getElementById("description");
  let impressum = document.getElementById("impressum");
  let impressumContainer = document.getElementById("impressum-container");
  description.classList.add("hidden");
  description.classList.remove("show");
  impressum.classList.add("hidden");
  impressum.classList.remove("show");
  impressumContainer.style.display = "block";
  document.body.style.overflow = "hidden";
}

/**
 * Checks the device orientation and shows/hides the "rotate device" message.
 */
function checkOrientation() {
  const rotateMessage = document.getElementById("rotate");
  if (!rotateMessage) {
    return;
  }
  if (window.matchMedia("(orientation: landscape)").matches) {
    rotateMessage.style.display = "none";
  } else {
    rotateMessage.style.display = "flex";
  }
}
window.addEventListener("orientationchange", checkOrientation);

/**
 * Initializes the game when the DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  init();
  checkOrientation();
});
