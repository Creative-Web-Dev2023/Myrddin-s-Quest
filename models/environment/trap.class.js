/**
 * Represents a trap in the game that can snap shut.
 * @extends MovableObject
 */
class Trap extends MovableObject {
  /**
   * The hitbox offset for the trap.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 55, bottom: 50, left: 30, right: 30 };

  /**
   * Indicates whether the trap is shut.
   * @type {boolean}
   */
  isShut;

  /**
   * Creates a new Trap instance.
   * @param {number} x - The x-coordinate position of the trap.
   */
  constructor(x) {
    super();
    this.addToImageCache("trap", LOADED_IMAGES.game_items.trap);
    this.img = this.imageCache["trap_0"];
    this.x = x;
    this.y = 380;
    this.height = 150;
    this.width = 150;
    this.isShut = false;
  }

  /**
   * Snaps the trap shut and plays animation and sound.
   */
  shutTrap() {
    if (!this.isShut) {
      this.playAnimationOnce(LOADED_IMAGES.game_items.trap, () => {
        this.isShut = true;
      });
      this.playSound(LOADED_SOUNDS.trap.snap);
    }
  }
}
