/**
 * Adjusts the size of the canvas to maintain the aspect ratio.
 */
function adjustCanvasSize() {
  const canvas = document.getElementById("canvas");
  const container = document.getElementById("canvas-container");
  const aspectRatio = 3 / 2; 
  let newWidth = window.innerWidth * 0.98;
  let newHeight = newWidth / aspectRatio; 

  if (newHeight > window.innerHeight * 0.98) {
    newHeight = window.innerHeight * 0.98;
    newWidth = newHeight * aspectRatio;
  }
  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
  container.style.width = `${newWidth}px`;
  container.style.height = `${newHeight}px`;

  matchGameOverSizeToCanvas();
}

window.addEventListener("resize", adjustCanvasSize);
document.addEventListener("DOMContentLoaded", adjustCanvasSize);


adjustCanvasSize();

/**
 * Detects if the device is a touch device.
 * @returns {boolean} True if the device is a touch device, false otherwise.
 */
function detectTouchDevice() {
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  document.body.classList.toggle("touch-device", isTouch);
  document.body.classList.toggle("desktop-device", !isTouch);
  return isTouch;
}

/**
 * Sets up touch controls for the game.
 */
function setupTouchControls() {
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  document.body.classList.toggle("touch-device", isTouch);
  document.body.classList.toggle("desktop-device", !isTouch);
  if (isTouch) {
    document.getElementById("controls").style.display = "flex";
  }
}

/**
 * Sets up responsive events for the game.
 */
function setupResponsiveEvents() {
  const isTouchDevice = detectTouchDevice();
  if (isTouchDevice) {
    setupTouchControls();
    adjustControlButtons();
  }
  window.addEventListener("resize", handleResponsiveResize);
}

/**
 * Handles the resize event to adjust the canvas size and check orientation.
 */
function handleResponsiveResize() {
  adjustCanvasSize();
  checkOrientation();
  if (document.body.classList.contains("touch-device")) {
    adjustControlButtons();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  detectTouchDevice();
  setupResponsiveEvents();
  checkOrientation();
  adjustCanvasSize();
});

/**
 * Adjusts the control buttons for touch devices.
 */
function matchGameOverSizeToCanvas() {
  const canvas = document.getElementById("canvas");
  const gameOver = document.getElementById("game-over-container");
  const winScreen = document.getElementById("win-screen");

  if (canvas && gameOver && winScreen) {
    gameOver.style.width = canvas.style.width;
    gameOver.style.height = canvas.style.height;
  }
}

window.addEventListener("resize", matchGameOverSizeToCanvas);
document.addEventListener("DOMContentLoaded", matchGameOverSizeToCanvas);
