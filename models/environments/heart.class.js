/**
 * Represents a collectible heart object in the game environment.
 * Inherits from MovableObject and is used to restore player health.
 *
 * @class Heart
 * @extends MovableObject
 *
 * @property {{top: number, bottom: number, left: number, right: number}} offset - The offset for collision detection.
 * @property {HTMLImageElement} img - The image representing the heart.
 * @property {number} x - The horizontal position of the heart.
 * @property {number} y - The vertical position of the heart (randomized on creation).
 * @property {number} startY - The initial vertical position of the heart.
 * @property {number} height - The height of the heart image.
 * @property {number} width - The width of the heart image.
 * @property {number} floatAmplitude - The amplitude of the floating animation.
 * @property {number} floatSpeed - The speed of the floating animation.
 * @property {HTMLAudioElement} collectingSound - The sound played when the heart is collected.
 *
 * @constructor
 * @param {number} x - The initial horizontal position of the heart.
 */
class Heart extends MovableObject {
  offset = { top: 0, bottom: 0, left: 0, right: 0 };
  constructor(x) {
    super();
    this.img = LOADED_IMAGES.game_items.heart;
    this.x = x;
    this.y = Math.floor(Math.random() * 180) + 50;
    this.startY = this.y;
    this.height = 50;
    this.width = 50;
    this.floatAmplitude = 15;
    this.floatSpeed = 1.5;
    this.collectingSound = LOADED_SOUNDS.heart.collected;
    this.collectingSound.volume = 0.5;
  }
}