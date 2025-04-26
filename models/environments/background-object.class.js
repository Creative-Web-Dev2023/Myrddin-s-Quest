/**
 * Class representing a background object.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  /**
   * Creates an instance of BackgroundObject.
   * @param {string} imagePath - The path to the image.
   * @param {number} x - The x position of the background object.
   * @param {number} [y=-20] - The y position of the background object.
   * @param {number} [width=720] - The width of the background object.
   * @param {number} [height=500] - The height of the background object.
   */
  constructor(imageObject, x, y = -20, width = 720, height = 500) {
    super();
    this.loadImages(imageObject);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Moves the background object to the left.
   * @param {number} speed - The speed at which to move the object.
   */
  move(speed) {
    this.x -= speed;
    if (this.x <= -this.width) {
      this.x += this.width;
    }
  }

  /**
   * Draws the background object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    const imageProps = {
      candle: { width: 200, height: 320, yOffset: 115 },
      skull: { width: 180, height: 160, yOffset: 273 },
    };

    const imgType = Object.keys(imageProps).find((type) =>
      this.img.src.includes(type)
    );

    if (imgType) {
      const props = imageProps[imgType];
      ctx.drawImage(
        this.img,
        this.x,
        this.y + props.yOffset,
        props.width,
        props.height
      );
    } else {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}