/**
 * Initializes dynamic UI elements and attaches them to the UI object.
 */
function initDynamicUIElements() {
  UI.innerStartContainer = document.getElementById("inner_start_container");
  UI.instructionsBox = document.getElementById("instructions_box");
  UI.musicButton = document.getElementById("music_button");
  UI.musicButtonOnCanvas = document.getElementById("music_button_on_canvas");
  UI.musicCaption = document.getElementById("music_caption");
  UI.noiseButton = document.getElementById("noise_button");
  UI.noiseButtonOnCanvas = document.getElementById("noise_button_on_canvas");
  UI.noiseCaption = document.getElementById("noise_caption");
}

/**
 * Displays the game rules section.
 */
function showGameRules(innerStartContainer, instructionsBox) {
  replaceBackgroundImageByColor();
  showHowToPlaySection(innerStartContainer, instructionsBox);
}

/**
 * Displays the imprint section.
 */
function showImprint(innerStartContainer, instructionsBox) {
  replaceBackgroundImageByColor();
  showImprintSection(innerStartContainer, instructionsBox);
}

/**
 * Replaces the background image of the start container with a solid color.
 */
function replaceBackgroundImageByColor() {
  UI.startContainer.style.backgroundImage = "none";
  UI.startContainer.style.backgroundColor = "#1f2e40";
}

/**
 * Replaces the background color of the start container with an image.
 */
function replaceBackgroundColorByImage() {
  UI.startContainer.style.backgroundColor = "";
  UI.startContainer.style.backgroundImage =
    "url(../assets/img/game_backgrounds/wood.png)";
}

/**
 * Plays background music if the music flag is enabled.
 */
function playMusicIfRequired() {
  if (window.flags.music) {
    LOADED_SOUNDS.game.background.play();
  }
}

/**
 * Toggles a boolean flag in window.flags and stores it in localStorage.
 */
function toggleAndStore(flagName) {
  const newValue = !window.flags[flagName];
  window.flags[flagName] = newValue;
  localStorage.setItem(flagName, newValue);
  return newValue;
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
 * Returns the image path for the music button based on the music flag.
 */
function setMusicButtonImages() {
  return window.flags.music
    ? "./assets/img/game_ui/sounds/music_on.png"
    : "./assets/img/game_ui/sounds/music_off.png";
}

/**
 * Returns the caption for the music button based on the music flag.
 */
function setMusicCaption() {
  return window.flags.music ? "Music on" : "Music off";
}

/**
 * Returns the image path for the noise button based on the noises flag.
 */
function setNoiseButtonImages() {
  return window.flags.noises
    ? "./assets/img/game_ui/sounds/noise_on.png"
    : "./assets/img/game_ui/sounds/noise_off.png";
}

/**
 * Returns the caption for the noise button based on the noises flag.
 */
function setNoiseCaption() {
  return window.flags.noises ? "Noise on" : "Noise off";
}
