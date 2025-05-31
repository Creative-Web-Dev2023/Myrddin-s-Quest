let canvas;
let ctx;
let keyboard = new Keyboard();
let world;
let loopId = null;
let gameStarted = false;

/**
 * Initializes the game by getting the canvas and preloading assets.
 */
function init() {
  canvas = document.getElementById("canvas");
  preloadAssets();
}

/**
 * Preloads all images from a structured path object.
 * @param {Object} paths - The image paths object.
 * @returns {Promise<Object>} A promise that resolves with all loaded images.
 */
function preloadImagesStructured(paths) {
  const result = {};
  collectPathsAsImages(paths, result);
  const allImages = extractAllImages(result);
  return waitForAllImagesToLoad(allImages, result);
}

/**
 * Recursively collects image paths and creates HTMLImageElements.
 * @param {Object} src - The source object with image paths.
 * @param {Object} target - The target object to store images.
 */
function collectPathsAsImages(src, target) {
  for (const key in src) {
    const val = src[key];
    if (typeof val === "string") {
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
 * Extracts all HTMLImageElements from a nested object.
 * @param {Object} obj - The object to search.
 * @returns {HTMLImageElement[]} Array of all found images.
 */
function extractAllImages(obj) {
  const list = [];
  (function collect(o) {
    for (const key in o) {
      const val = o[key];
      if (val instanceof HTMLImageElement) {
        list.push(val);
      } else if (typeof val === "object") {
        collect(val);
      }
    }
  })(obj);
  return list;
}

/**
 * Waits for all images to load.
 * @param {HTMLImageElement[]} images - Array of images to wait for.
 * @param {Object} result - The result object to resolve with.
 * @returns {Promise<Object>}
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
 * Preloads all sounds from a structured path object.
 * @param {Object} paths - The sound paths object.
 * @returns {Promise<Object>} A promise that resolves with all loaded sounds.
 */
function preloadSoundsStructured(paths) {
  const result = {};
  collectPathsAsSounds(paths, result);
  const allSounds = extractAllSounds(result);
  return waitForAllSoundsToLoad(allSounds, result);
}

/**
 * Recursively collects sound paths and creates HTMLAudioElements.
 * @param {Object} src - The source object with sound paths.
 * @param {Object} target - The target object to store sounds.
 */
function collectPathsAsSounds(src, target) {
  for (const key in src) {
    const val = src[key];
    if (typeof val === "string") {
      const audio = new Audio(val);
      target[key] = audio;
    } else {
      target[key] = Array.isArray(val) ? [] : {};
      collectPathsAsSounds(val, target[key]);
    }
  }
}

/**
 * Extracts all HTMLAudioElements from a nested object.
 * @param {Object} obj - The object to search.
 * @returns {HTMLAudioElement[]} Array of all found sounds.
 */
function extractAllSounds(obj) {
  const list = [];
  (function collect(o) {
    for (const key in o) {
      const val = o[key];
      if (val instanceof HTMLAudioElement) {
        list.push(val);
      } else if (typeof val === "object") {
        collect(val);
      }
    }
  })(obj);
  return list;
}

/**
 * Waits for all sounds to load.
 * @param {HTMLAudioElement[]} sounds - Array of sounds to wait for.
 * @param {Object} result - The result object to resolve with.
 * @returns {Promise<Object>}
 */
function waitForAllSoundsToLoad(sounds, result) {
  return new Promise((resolve) => {
    let loaded = 0;
    sounds.forEach((audio) => {
      const onLoaded = () => {
        audio.removeEventListener("canplaythrough", onLoaded);
        audio.removeEventListener("error", onLoaded);
        if (++loaded === sounds.length) {
          resolve(result);
        }
      };
      audio.addEventListener("canplaythrough", onLoaded);
      audio.addEventListener("error", onLoaded);
      audio.load();
    });
    if (sounds.length === 0) resolve(result);
  });
}

/**
 * Preloads all game assets (images, fonts, sounds).
 */
function preloadAssets() {
  document.getElementById("loadingMessage").classList.remove("d-none");
  Promise.all([
    preloadImagesStructured(IMAGE_PATHS),
    document.fonts.load("20px MedievalSharp"),
    preloadSoundsStructured(SOUND_PATHS),
  ])
    .then(([loadedImages, _, loadedSounds]) => {
      window.LOADED_IMAGES = loadedImages;
      window.LOADED_SOUNDS = loadedSounds;
      document.getElementById("loadingMessage").classList.add("d-none");
      showInfoBox();
    })
    .catch((err) => {
      console.error("Fehler beim Laden der Assets:", err);
    });
}

/**
 * Shows the info/start box on the main menu.
 */
function showInfoBox() {
  const startContainer = document.getElementById("start_container");
  startContainer.innerHTML += generateStartContentHTML();
}

/**
 * Shows different content screens (game, instructions, imprint, winner).
 * @param {string} content - The content type to show.
 */
function showContent(content) {
  const innerStartContainer = document.getElementById("inner_start_container");
  const instructionsBox = document.getElementById("instructions_box");
  innerStartContainer.classList.remove("d-none");
  instructionsBox.classList.add("d-none");
  if (content === "startGame") {
    startGame();
  } else if (content === "howToPlay") {
    innerStartContainer.classList.add("d-none");
    instructionsBox.classList.remove("d-none");
    instructionsBox.innerHTML = generateAboutGameHtml();
  } else if (content === "imprint") {
    innerStartContainer.classList.add("d-none");
    instructionsBox.classList.remove("d-none");
    instructionsBox.innerHTML = generateImprintHtml();
  } else if (content === "winnerScreen") {
    innerStartContainer.classList.add("d-none");
    instructionsBox.classList.remove("d-none");
    instructionsBox.innerHTML = generateWinnerScreen();
  }
}

/**
 * Returns to the main start screen from sub-screens.
 */
function backToMainScreen() {
  const innerStartContainer = document.getElementById("inner_start_container");
  const instructionsBox = document.getElementById("instructions_box");
  innerStartContainer.classList.remove("d-none");
  instructionsBox.classList.add("d-none");
}

/**
 * Starts the game, initializes world and UI.
 */
function startGame() {
  const startScreen = document.getElementById("startScreen");
  const canvas = document.getElementById("canvas");
  const canvasWrapper = document.getElementById("canvas_wrapper");
  const gameButtons = document.getElementById("game_buttons");
  const mobileButtons = document.getElementById("mobile_buttons");
  gameButtons.classList.remove("d-none");
  gameButtons.innerHTML = generateGameButtonsHTML();
  mobileButtons.classList.remove("d-none");
  startScreen.classList.add("d-none");
  canvasWrapper.classList.remove("d-none");
  canvas.classList.remove("d-none");
  ctx = canvas.getContext("2d");
  const level1 = createLevel1();
  world = new World(canvas, keyboard, level1);
  keyboard.setupControls();
  keyboard.linkButtonsToPressEvents();
  gameStarted = true;
  if (music) {
    LOADED_SOUNDS.game.background.play();
  }
  gameLoop();
}

/**
 * The main game loop, updates and draws the world.
 */
function gameLoop() {
  if (world.running === false) {
    cancelAnimationFrame(world.loopID);
    return;
  }
  world.update();
  world.draw();
  world.loopID = requestAnimationFrame(gameLoop);
}

/**
 * Restarts the game by resetting world and animation frame.
 */
function restartGame() {
  world = null;
  cancelAnimationFrame(loopId);
  loopId = null;
  startGame();
}

/**
 * Shows the end screen (winner or loser).
 * @param {string} screenType - The type of end screen to show.
 */
function showEndScreen(screenType) {
  canvasWrapper = document.getElementById("canvas_wrapper");
  canvasWrapper.classList.add("d-none");
  const startScreen = document.getElementById("startScreen");
  const endScreen = document.getElementById("end_screen");
  startScreen.classList.add("d-none");
  endScreen.classList.remove("d-none");
  if (screenType === "winnerScreen") {
    endScreen.innerHTML = generateWinnerScreenHTML();
  } else if (screenType === "loserScreen") {
    endScreen.innerHTML = generateLoserScreenHTML();
  } else {
    console.error("Unknown screenType");
  }
}

/**
 * Shows the start screen and hides the end screen.
 */
function showStartScreen() {
  const startScreen = document.getElementById("startScreen");
  const endScreen = document.getElementById("end_screen");
  startScreen.classList.remove("d-none");
  endScreen.classList.add("d-none");
}

/**
 * Toggles sound settings for music or noise.
 * @param {string} soundType - The type of sound to toggle ('music' or 'noise').
 */
function toggleSound(soundType) {
  if (soundType === "music") {
    toggleMusic();
  } else if (soundType === "noise") {
    toggleNoise();
  } else {
    console.error("Unknown soundType", soundType);
  }
}

/**
 * Toggles the background music on or off and updates the UI.
 */
function toggleMusic() {
  music = !music;
  localStorage.setItem("music", music);
  if (music) {
    if (gameStarted) {
      LOADED_SOUNDS.game.background.play();
    }
  } else {
    LOADED_SOUNDS.game.background.pause();
  }
  updateMusicButtons();
}

/**
 * Updates the music button icons and captions.
 */
function updateMusicButtons() {
  const musicButton = document.getElementById("music_button");
  const musicButtonOnCanvas = document.getElementById("music_button_on_canvas");
  const musicCaption = document.getElementById("music_caption");
  if (musicButton) {
    musicButton.src = music
      ? "./assets/img/game_ui/sounds/music_on.png"
      : "./assets/img/game_ui/sounds/music_off.png";
    musicCaption.innerText = music ? "Music on" : "Music off";
  }
  if (musicButtonOnCanvas) {
    musicButtonOnCanvas.src = music
      ? "./assets/img/game_ui/sounds/music_on.png"
      : "./assets/img/game_ui/sounds/music_off.png";
  }
}

/**
 * Toggles the sound effects (noise) on or off and updates the UI.
 */
function toggleNoise() {
  noises = !noises;
  localStorage.setItem("noises", noises);
  updateNoiseButtons();
}

/**
 * Updates the noise button icons and captions.
 */
function updateNoiseButtons() {
  const noiseButton = document.getElementById("noise_button");
  const noiseButtonOnCanvas = document.getElementById("noise_button_on_canvas");
  const noiseCaption = document.getElementById("noise_caption");
  if (noiseButton) {
    noiseButton.src = noises
      ? "./assets/img/game_ui/sounds/noise_on.png"
      : "./assets/img/game_ui/sounds/noise_off.png";
    noiseCaption.innerText = noises ? "Noise on" : "Noise off";
  }
  if (noiseButtonOnCanvas) {
    noiseButtonOnCanvas.src = noises
      ? "./assets/img/game_ui/sounds/noise_on.png"
      : "./assets/img/game_ui/sounds/noise_off.png";
  }
}
