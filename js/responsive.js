/**
 * Adjusts the size of the canvas to maintain the aspect ratio.
 */
function adjustCanvasSize() {
  const canvas = document.getElementById("canvas");
  const aspectRatio = 16 / 9;
  if (window.innerWidth / aspectRatio < window.innerHeight) {
    canvas.style.width = "95vw";
    canvas.style.height = `${95 / aspectRatio}vw`;
  } else {
    canvas.style.height = "95vh";
    canvas.style.width = `${95 * aspectRatio}vh`;
  }
}

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
