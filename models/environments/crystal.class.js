/**
 * Class representing a Crystal.
 * @extends DrawableObject
 */
class Crystal extends DrawableObject {
  /**
   * Creates an instance of Crystal.
   * @param {number} x - The x position of the crystal.
   * @param {number} y - The y position of the crystal.
   */
  constructor(x, y) {
    super();
    this.loadImages(LOADED_IMAGES.game_items.crystal);
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;
    this.isActive = true;
    this.isCollected = false;
    this.glowIntensity = 0;
    this.glowDirection = 1;
    this.animateGlow();
  }

  /**
   * Animates the glow effect of the crystal.
   */
  animateGlow() {
    setInterval(() => {
      if (this.isActive) {
        this.glowIntensity += this.glowDirection * 0.05;
        if (this.glowIntensity > 1 || this.glowIntensity < 0) {
          this.glowDirection *= -1;
        }
      }
    }, 50);
  }

  /**
   * Draws the crystal on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    super.draw(ctx);
    if (this.isActive) {
      ctx.save();
      ctx.globalAlpha = this.glowIntensity * 0.3;
      ctx.filter = `blur(${this.glowIntensity * 5}px) brightness(${
        1 + this.glowIntensity
      })`;
      ctx.drawImage(
        this.img,
        this.x - this.glowIntensity * 10,
        this.y - this.glowIntensity * 10,
        this.width + this.glowIntensity * 20,
        this.height + this.glowIntensity * 20
      );
      ctx.restore();
    }
  }

  /**
   * Deactivates the crystal.
   */
  deactivate() {
    this.isActive = false;
    this.isCollected = true;
    this.glowIntensity = 0;
  }

  /**
   * Collects the crystal and shows the win screen.
   */
  collect() {
    if (this.isActive && this.world?.endGame) {
      this.deactivate();
      this.world.level.objects = this.world.level.objects.filter( (obj) => obj !== this); 
      setTimeout(() => {
        this.world.endGame.showYouWinScreen(); 
      }, 300);
    }
  }

  /**
   * Removes the crystal after the final boss is defeated.
   */
  removeAfterBossDeath() {
    this.isActive = false;
    this.isCollected = true;
    this.x = -100;
    this.y = -100;
  }
}