/**
 * Represents a key collectible object in the game.
 * @extends MovableObject
 */
class Key extends MovableObject {
  /**
   * The hitbox offset for the key object.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 10, bottom: 10, left: 10, right: 10 };

  /**
   * Creates a new Key instance.
   * @param {number|null} [x=null] - The X position of the key. If null, a random position is used.
   * @param {number} [y=130] - The Y position of the key.
   */
  /**
   * Creates an instance of the Key class.
   * 
   * @param {number|null} [x=null] - The x-coordinate of the key. If null, a random value between 200 and 5200 is assigned.
   * @param {number} [y=130] - The y-coordinate of the key.
   * 
   * @property {HTMLImageElement} img - The image representing the key, loaded from LOADED_IMAGES.
   * @property {number} x - The x-coordinate of the key.
   * @property {number} y - The y-coordinate of the key.
   * @property {number} startY - The initial y-coordinate of the key.
   * @property {number} width - The width of the key image.
   * @property {number} height - The height of the key image.
   * @property {number} floatAmplitude - The amplitude of the floating animation.
   * @property {number} floatSpeed - The speed of the floating animation.
   * @property {number} floatOffset - The offset used for the floating animation.
   * @property {HTMLAudioElement} pingSound - The sound played when the key is collected.
   */
  constructor(x = null, y = 130) {
    super();
    this.img = LOADED_IMAGES.game_items.key;
    this.x = x !== null ? x : 200 + Math.floor(Math.random() * 5000);
    this.y = y;
    this.startY = this.y;
    this.width = 70;
    this.height = 70;
    this.floatAmplitude = 20;
    this.floatSpeed = 2;
    this.floatOffset = 0;
    this.pingSound = LOADED_SOUNDS.key.collected;
    this.pingSound.volume = 0.5;
  }
}
