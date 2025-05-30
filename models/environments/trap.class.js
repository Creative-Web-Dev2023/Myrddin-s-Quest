class Trap extends MovableObject {
  offset = { top: 55, bottom: 50, left: 30, right: 30 };

  constructor(x) {
    super();
    this.addToImageCache('trap', LOADED_IMAGES.game_items.trap);
    this.img = this.imageCache['trap_0'];
    this.x = x;
    this.y = 380;
    this.height = 150;
    this.width = 150;
    this.isShut = false;
  }

  shutTrap() {
    if (!this.isShut) {
      this.playAnimationOnce(LOADED_IMAGES.game_items.trap, () => {
        this.isShut = true;
      });
      this.playSound(LOADED_SOUNDS.trap.snap);
    }
  }

  drawFrame() {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 2;

    const offsetX = this.x + this.offset.left;
    const offsetY = this.y + this.offset.top;
    const offsetWidth = this.width - this.offset.left - this.offset.right;
    const offsetHeight = this.height - this.offset.top - this.offset.bottom;

    ctx.strokeRect(offsetX, offsetY, offsetWidth, offsetHeight);
  }
}