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
 * Waits for all images to finish loading.
 */
function waitForAllImagesToLoad(images, result) {
  return new Promise((resolve) => {
    let loaded = 0;
    images.forEach((img) => {
      img.onload = img.onerror = () => {
        if (++loaded === images.length) {resolve(result); }
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
 * Waits for all sounds to finish loading.
 */
function waitForAllSoundsToLoad(sounds, result) {
  return new Promise((resolve) => {
    let loaded = 0;
    loadSounds(sounds, result, loaded, resolve);
    if (sounds.length === 0) resolve(result);
  });
}
/**
 * Preloads all assets (images, fonts, sounds) and shows the info box when done.
 */
function preloadAssets() {
  document.getElementById('loadingMessage').classList.remove('d-none');

  Promise.all([
    preloadImagesStructured(IMAGE_PATHS),
    document.fonts.load('20px MedievalSharp'),
    preloadSoundsStructured(SOUND_PATHS),
  ])
    .then(handleAssetLoadSuccess)
    .catch(handleAssetLoadError);
}
/**
 * Shows the info box/start screen after assets are loaded.
 */
function showInfoBox() {
  UI.startContainer.innerHTML += generateStartContentHTML();
  initDynamicUIElements();
}

/**
 * Shows the selected content section (game, how to play, imprint).
 * @param {string} content
 */
function showContent(content) {
  replaceBackgroundColorByImage();
  UI.innerStartContainer.classList.remove('d-none');
  UI.instructionsBox.classList.add('d-none');
  selectStartScreenSection(content, UI.innerStartContainer, UI.instructionsBox);
}

/**
 * Selects and displays the correct start screen section.
 */
function selectStartScreenSection(content,innerStartContainer,instructionsBox) {
  if (content === 'startGame') {
    startGame();
  } else if (content === 'howToPlay') {
    showGameRules(innerStartContainer, instructionsBox);
  } else if (content === 'imprint') {
    showImprint(innerStartContainer, instructionsBox);

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
 * Returns to the main start screen.
 */
function backToMainScreen() {
  replaceBackgroundColorByImage();
  UI.innerStartContainer.classList.remove('d-none');
  UI.instructionsBox.classList.add('d-none');
}
/**
 * Starts the game, initializes world and keyboard, and begins the game loop.
 */
function startGame() {
  showOrHideStartScreenElement();
  initDynamicUIElements();
  ctx = canvas.getContext('2d');
  const level1 = createLevel1();
  world = new World(canvas, keyboard, level1);
  keyboard.setupControls();
  keyboard.linkButtonsToPressEvents();
  gameStarted = true;
  playMusicIfRequired();
  gameLoop();
}

/**
 * Shows or hides start screen elements and displays the canvas.
 */
  function showOrHideStartScreenElement() {
    UI.gameButtons.classList.remove('d-none');
    UI.gameButtons.innerHTML = generateGameButtonsHTML();
    UI.mobileButtons.classList.remove('d-none');
    UI.startScreen.classList.add('d-none');
    UI.canvasWrapper.classList.remove('d-none');
    UI.canvas.classList.remove('d-none');
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
  UI.canvasWrapper.classList.add('d-none');
  UI.startScreen.classList.add('d-none');
  UI.endScreen.classList.remove('d-none');
  if (screenType === 'winnerScreen') {
    UI.endScreen.innerHTML = generateWinnerScreenHTML();
  } else if (screenType === 'loserScreen') {
    UI.endScreen.innerHTML = generateLoserScreenHTML();
  } else {
    console.error('Unknown screenType');
  }
}

/**
 * Shows the start screen and hides the end screen.
 */
function showStartScreen() {
  UI.startScreen.classList.remove('d-none');
  UI.endScreen.classList.add('d-none');
}

/**
 * Toggles music or noise sound settings and updates UI.
 */
function toggleSound(soundType) {
  if (soundType === 'music') {
    toggleAndStore('music');
    checkIfMusic();
    checkIfMusicButtonOnStartScreen(UI.musicButton, UI.musicCaption);
    checkIfMusicButtonOnCanvas(UI.musicButtonOnCanvas);
  } else if (soundType === 'noise') {
    toggleAndStore('noises');
    checkIfNoiseButtonOnStartScreen(UI.noiseButton, UI.noiseCaption);
    checkIfNoiseButtonOnCanvas(UI.noiseButtonOnCanvas);
  } else {
    console.error('Unknown soundType', soundType);
  }
}

/**
 * Checks if music should be played or paused.
 */
function checkIfMusic() {
  if (window.flags.music) {
    if (gameStarted) {
      LOADED_SOUNDS.game.background.play();
    }
  } else {
    LOADED_SOUNDS.game.background.pause();
  }
}

