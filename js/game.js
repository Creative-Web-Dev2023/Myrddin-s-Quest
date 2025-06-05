/**
 * Main game script for initializing, loading assets, and controlling the game loop.
 */

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
 */
function preloadImagesStructured(paths) {
  const result = {};
  collectPathsAsImages(paths, result);
  const allImages = extractAllImages(result);
  return waitForAllImagesToLoad(allImages, result);
}

/**
 * Recursively collects image paths and creates HTMLImageElements.
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
 * Waits for all images to finish loading.
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
 */
function preloadSoundsStructured(paths) {
  const result = {};
  collectPathsAsSounds(paths, result);
  const allSounds = extractAllSounds(result);
  return waitForAllSoundsToLoad(allSounds, result);
}

/**
 * Recursively collects sound paths and creates HTMLAudioElements.
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
 * Waits for all sounds to finish loading.
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
 * Preloads all assets (images, fonts, sounds) and shows the info box when done.
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
 * Shows the info box/start screen after assets are loaded.
 */
function showInfoBox() {
  const startContainer = document.getElementById("start_container");
  startContainer.innerHTML += generateStartContentHTML();
}

/**
 * Shows the selected content section (game, how to play, imprint).
 * @param {string} content
 */
function showContent(content) {
  replaceBackgroundColorByImage();
  const innerStartContainer = document.getElementById("inner_start_container");
  const instructionsBox = document.getElementById("instructions_box");
  innerStartContainer.classList.remove("d-none");
  instructionsBox.classList.add("d-none");
  selectStartScreenSection(content, innerStartContainer, instructionsBox);
}

/**
 * Selects and displays the correct start screen section.
 */
function selectStartScreenSection(content,innerStartContainer,instructionsBox) {
  if (content === "startGame") {
    startGame();
  } else if (content === "howToPlay") {
    replaceBackgroundImageByColor();
    showHowToPlaySection(innerStartContainer, instructionsBox);
  } else if (content === "imprint") {
    replaceBackgroundImageByColor();
    showImprintSection(innerStartContainer, instructionsBox);
  }
}

/**
 * Shows the "How to Play" section.
 */
function showHowToPlaySection(innerStartContainer, instructionsBox) {
  innerStartContainer.classList.add("d-none");
  instructionsBox.classList.remove("d-none");
  instructionsBox.innerHTML = generateAboutGameHtml();
}

/**
 * Shows the imprint section.
 */
function showImprintSection(innerStartContainer, instructionsBox) {
  innerStartContainer.classList.add("d-none");
  instructionsBox.classList.remove("d-none");
  instructionsBox.innerHTML = generateImprintHtml();
}

/**
 * Replaces the background image with a solid color.
 */
function replaceBackgroundImageByColor() {
  const startContainer = document.getElementById("start_container");
  startContainer.style.backgroundImage = "none";
  startContainer.style.backgroundColor = "#1f2e40";
}

/**
 * Replaces the background color with an image.
 */
function replaceBackgroundColorByImage() {
  const startContainer = document.getElementById("start_container");
  startContainer.style.backgroundColor = "";
  startContainer.style.backgroundImage ="url(../assets/img/game_backgrounds/wood.png)";
}

/**
 * Returns to the main start screen.
 */
function backToMainScreen() {
  replaceBackgroundColorByImage();
  const innerStartContainer = document.getElementById("inner_start_container");
  const instructionsBox = document.getElementById("instructions_box");
  innerStartContainer.classList.remove("d-none");
  instructionsBox.classList.add("d-none");
}

/**
 * Starts the game, initializes world and keyboard, and begins the game loop.
 */
function startGame() {
  const startScreen = document.getElementById("startScreen");
  const canvas = document.getElementById("canvas");
  const canvasWrapper = document.getElementById("canvas_wrapper");
  const gameButtons = document.getElementById("game_buttons");
  const mobileButtons = document.getElementById("mobile_buttons");
  showOrHideStartScreenElement(startScreen,canvasWrapper,gameButtons,mobileButtons);
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
 * Shows or hides start screen elements and displays the canvas.
 */
function showOrHideStartScreenElement(startScreen,canvasWrapper,gameButtons,mobileButtons) {
  gameButtons.classList.remove("d-none");
  gameButtons.innerHTML = generateGameButtonsHTML();
  mobileButtons.classList.remove("d-none");
  startScreen.classList.add("d-none");
  canvasWrapper.classList.remove("d-none");
  canvas.classList.remove("d-none");
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
 * Toggles music or noise sound settings and updates UI.
 */
function toggleSound(soundType) {
  const musicButton = document.getElementById("music_button");
  const musicButtonOnCanvas = document.getElementById("music_button_on_canvas");
  const musicCaption = document.getElementById("music_caption");
  const noiseButton = document.getElementById("noise_button");
  const noiseButtonOnCanvas = document.getElementById("noise_button_on_canvas");
  const noiseCaption = document.getElementById("noise_caption");
  if (soundType === "music") {
    music = !music;
    localStorage.setItem("music", music);
    checkIfMusic();
    checkIfMusicButtonOnStartScreen(musicButton, musicCaption);
    checkIfMusicButtonOnCanvas(musicButtonOnCanvas);
  } else if (soundType === "noise") {
    noises = !noises;
    localStorage.setItem("noises", noises);
    checkIfNoiseButtonOnStartScreen(noiseButton, noiseCaption);
    checkIfNoiseButtonOnCanvas(noiseButtonOnCanvas);
  } else {
    console.error("Unknown soundType", soundType);
  }
}

/**
 * Checks if music should be played or paused.
 */
function checkIfMusic() {
  if (music) {
    if (gameStarted) {
      LOADED_SOUNDS.game.background.play();
    }
  } else {
    LOADED_SOUNDS.game.background.pause();
  }
}

/**
 * Updates the music button and caption on the start screen.
 */
function checkIfMusicButtonOnStartScreen(musicButton, musicCaption) {
  if (musicButton) {
    musicButton.src = setMusicButtonImages();
    musicCaption.innerText = setMusicCaption();
  }
}

/**
 * Updates the music button on the canvas.
 */
function checkIfMusicButtonOnCanvas(musicButtonOnCanvas) {
  if (musicButtonOnCanvas) {
    musicButtonOnCanvas.src = setMusicButtonImages();
  }
}

/**
 * Updates the noise button and caption on the start screen.
 */
function checkIfNoiseButtonOnStartScreen(noiseButton, noiseCaption) {
  if (noiseButton) {
    noiseButton.src = setNoiseButtonImages();
    noiseCaption.innerText = setNoiseCaption();
  }
}

/**
 * Updates the noise button on the canvas.
 */
function checkIfNoiseButtonOnCanvas(noiseButtonOnCanvas) {
  if (noiseButtonOnCanvas) {
    noiseButtonOnCanvas.src = setNoiseButtonImages();
  }
}

/**
 * Returns the correct music button image path.
 */
function setMusicButtonImages() {
  return music
    ? "./assets/img/game_ui/sounds/music_on.png"
    : "./assets/img/game_ui/sounds/music_off.png";
}

/**
 * Returns the correct music caption.
 */
function setMusicCaption() {
  return music ? "Music on" : "Music off";
}

/**
 * Returns the correct noise button image path.
 */
function setNoiseButtonImages() {
  return noises
    ? "./assets/img/game_ui/sounds/noise_on.png"
    : "./assets/img/game_ui/sounds/noise_off.png";
}

/**
 * Returns the correct noise caption.
 */
function setNoiseCaption() {
  return noises ? "Noise on" : "Noise off";
}
