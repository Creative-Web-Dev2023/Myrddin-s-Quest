/**
 * UI elements used throughout the game.
 * @type {Object}
 * @property {HTMLElement} startContainer - The container for the start screen.
 * @property {HTMLCanvasElement} canvas - The main game canvas.
 * @property {HTMLElement} startScreen - The start screen element.
 * @property {HTMLElement} canvasWrapper - The wrapper for the canvas.
 * @property {HTMLElement} gameButtons - The container for game control buttons.
 * @property {HTMLElement} mobileButtons - The container for mobile control buttons.
 * @property {HTMLElement} endScreen - The end screen element.
 */
const UI = {
  startContainer: document.getElementById("start_container"),
  canvas: document.getElementById("canvas"),
  startScreen: document.getElementById("startScreen"),
  canvasWrapper: document.getElementById("canvas_wrapper"),
  gameButtons: document.getElementById("game_buttons"),
  mobileButtons: document.getElementById("mobile_buttons"),
  endScreen: document.getElementById("end_screen"),
};
