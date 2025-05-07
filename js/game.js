let canvas;
let ctx;
let keyboard = new Keyboard();
let world;
let IntervallIDs = [];
let loopId = null;


function handleFullscreenToggle() {
  const container = document.getElementById('canvas-container');
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

const gameState = {
  save() {
    localStorage.setItem(
      'gameState',
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
    const saved = JSON.parse(localStorage.getItem('gameState'));
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

function init() {
  canvas = document.getElementById('canvas');
  preloadImages();
  /*   ctx = canvas.getContext('2d');
  
  keyboard.setupControls(world);
  keyboard.setupTouchControls(world);
  gameLoop();
  document.getElementById('tryAgain').addEventListener('click', tryAgain);
  document.getElementById('quitButton').addEventListener('click', quitGame); */
}

/**
 * Recursively preloads all image paths into HTMLImageElements and returns them
 * as a structured object that mirrors the input `paths` structure.
 *
 * @param {Object} paths - Nested object of image paths (strings) grouped by category.
 * @returns {Promise<Object>} A promise that resolves with the same structure, but with loaded HTMLImageElements.
 */
function preloadImagesStructured(paths) {
  const result = {};
  collectPathsAsImages(paths, result);
  const allImages = extractAllImages(result);
  return waitForAllImagesToLoad(allImages, result);
}

/**
 * Recursively walks through the input object and replaces all image path strings
 * with new HTMLImageElement instances assigned to the same keys.
 *
 * @param {Object} src - The original image path object (e.g., IMAGE_PATHS).
 * @param {Object} target - The destination object to fill with HTMLImageElements.
 */
function collectPathsAsImages(src, target) {
  for (const key in src) {
    const val = src[key];
    if (typeof val === 'string') {
      const img = new Image();
      img.src = val;
      target[key] = img;
    } else {
      target[key] = Array.isArray(val) ? [] : {};
      collectPathsAsImages(val, target[key]);
    }
  }
}

/**
 * Collects all HTMLImageElement instances from a nested object structure.
 *
 * @param {Object} obj - The structured object containing nested image elements.
 * @returns {HTMLImageElement[]} A flat array of all HTMLImageElements found.
 */
function extractAllImages(obj) {
  const list = []; // Erstellt ein leeres Array, um alle gefundenen HTMLImageElement-Objekte zu speichern.
  
  (function collect(o) { // Definiert eine selbstaufrufende Funktion namens 'collect', die rekursiv arbeitet.
    for (const key in o) { // Iteriert über alle Eigenschaften des Objekts 'o'.
      const val = o[key]; // Holt den Wert der aktuellen Eigenschaft.
      if (val instanceof HTMLImageElement) { // Prüft, ob der Wert ein HTMLImageElement (Bild-Element) ist.
        list.push(val); // Falls ja, fügt es das Bild-Element dem 'list'-Array hinzu.
      } else if (typeof val === 'object') { // Prüft, ob der Wert ein Objekt ist (z. B. ein verschachteltes Objekt).
        collect(val); // Falls ja, ruft die Funktion 'collect' rekursiv mit diesem Objekt auf.
      }
    }
  })(obj); // Ruft die Funktion 'collect' mit dem übergebenen Objekt 'obj' auf.
  return list; // Gibt das Array mit allen gefundenen HTMLImageElement-Objekten zurück.
}

/**
 * Returns a promise that resolves once all given images have finished loading or failed.
 *
 * @param {HTMLImageElement[]} images - Array of images to wait for.
 * @param {Object} result - The final structured object to resolve with.
 * @returns {Promise<Object>} A promise resolving to the result object when all images are ready.
 */
function waitForAllImagesToLoad(images, result) {
  return new Promise((resolve) => {
    let loaded = 0;
    images.forEach((img) => {
      img.onload = img.onerror = () => {
        if (++loaded === images.length) {
          resolve(result);
        }
      };
    });
  });
}

/**
 * Preloads all image assets defined in the IMAGE_PATHS object using a structured loading method.
 *
 * This function also manages UI feedback for the user:
 * - Shows a loading message while images are being loaded.
 * - Hides the message once loading is complete.
 * - Stores the loaded image objects in the global `LOADED_IMAGES` variable.
 * - Calls `showInfoBox()` to display the game's info screen once everything is ready.
 *
 * If an error occurs during image loading, it is logged to the console.
 */
function preloadImages() {
  document.getElementById('loadingMessage').classList.remove('d-none');
  preloadImagesStructured(IMAGE_PATHS)
    .then((loadedImages) => {
      window.LOADED_IMAGES = loadedImages;
      console.log('Geladene Bilder: ', LOADED_IMAGES);
      document.getElementById('loadingMessage').classList.add('d-none');
      showInfoBox();
    })
    .catch((err) => {
      console.error('Error loading images:', err);
    });
}

/**
 * Displays the info box by updating the html content.
 */
function showInfoBox() {
  const startContainer = document.getElementById('start_container');
  startContainer.innerHTML += generateStartContentHTML();
}

function showContent(content) {
  const innerStartContainer = document.getElementById('inner_start_container');
  const instructionsBox = document.getElementById('instructions_box');
  innerStartContainer.classList.remove('d-none');
  instructionsBox.classList.add('d-none');
  if (content === 'startGame') {
    startGame();
  } else if (content === 'howToPlay') {
    innerStartContainer.classList.add('d-none');
    instructionsBox.classList.remove('d-none');
    instructionsBox.innerHTML = generateAboutGameHtml();
  } else if (content === 'imprint') {
    innerStartContainer.classList.add('d-none');
    instructionsBox.classList.remove('d-none');
    instructionsBox.innerHTML = generateImprintHtml();
  }
}

function backToMainScreen() {
  const innerStartContainer = document.getElementById('inner_start_container');
  const instructionsBox = document.getElementById('instructions_box');
  innerStartContainer.classList.remove('d-none');
  instructionsBox.classList.add('d-none');
}

function startGame() {
  const startScreen = document.getElementById('startScreen');
  const gameScreen = document.querySelector('.game-screen');
  gameScreen.insertAdjacentHTML('beforeend', generateGameOverHTML());
  gameScreen.insertAdjacentHTML('beforeend', generateWinScreenHTML());
  document.getElementById('tryAgainButton').addEventListener('click', () => {
    world.endGame.restartGame();
  });
  const canvas = document.getElementById('canvas');
  startScreen.classList.add('d-none');
  canvas.classList.remove('d-none');
  ctx = canvas.getContext('2d');
  const level1 = createLevel1();
  world = new World(canvas, keyboard, level1);
  window.endGame = world.endGame;
  keyboard.setupControls(world);
  keyboard.setupTouchControls(world);
  gameLoop();
}

function gameLoop() {
  if (world.loopID) cancelAnimationFrame(world.loopID);
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

/* function quitGame() {
  location.reload();
} */

/* function toggleFullscreen() {
  const container = document.getElementById('canvas_container');
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
} */

/* function handleImpressum() {
  let impressum = document.getElementById('impressum');
  impressum.classList.toggle('hidden');
  impressum.classList.toggle('show');
} */

/* function handleDescription() {
  const description = document.getElementById('description');
  const impressumContainer = document.getElementById('impressum-container');
  description.classList.toggle('hidden');
  description.classList.toggle('show');
  impressumContainer.style.display = description.classList.contains('show')
    ? 'none'
    : 'block';
  if (description.classList.contains('show')) {
    document.body.style.overflow = 'auto';
  } else {
    document.body.style.overflow = 'hidden';
  }
} */

/* function goBack() {
  let description = document.getElementById('description');
  let impressum = document.getElementById('impressum');
  let impressumContainer = document.getElementById('impressum-container');
  description.classList.add('hidden');
  description.classList.remove('show');
  impressum.classList.add('hidden');
  impressum.classList.remove('show');
  impressumContainer.style.display = 'block';
  document.body.style.overflow = 'hidden';
} */

/* function checkOrientation() {
  const rotateMessage = document.getElementById('rotate');
  if (!rotateMessage) {
    return;
  }
  if (window.matchMedia('(orientation: landscape)').matches) {
    rotateMessage.style.display = 'none';
  } else {
    rotateMessage.style.display = 'flex';
  }
}
window.addEventListener('orientationchange', checkOrientation);

document.addEventListener('DOMContentLoaded', () => {
  init();
  checkOrientation();
}); */