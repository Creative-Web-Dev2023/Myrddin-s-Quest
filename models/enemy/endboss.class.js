class Endboss extends MovableObject {
  innerOffset = { top: 10, bottom: 100, left: 250, right: 180 };
  outerOffset = { top: 10, bottom: 100, left: 40, right: 50 };
  constructor() {
    super();
    this.addToImageCache("walk", LOADED_IMAGES.troll.walk);
    this.addToImageCache("hurt", LOADED_IMAGES.troll.hurt);
    this.addToImageCache("dead", LOADED_IMAGES.troll.die);

    this.img = this.imageCache["walk_0"];
    this.deadAnimationPlayed = false;
    this.height = 409;
    this.width = 700;
    this.y = 100;
    this.x = 5500;
    this.speed = 2;

    this.energy = 100;
    this.healthBar;
    this.patrolMin = 5000;
    this.patrolMax = 5800;
    this.nextTurnPoint = this.getRandomTurnPoint("left");

  }

  update() {
   if(this.isDeadAlready)return;
   this.handleAnimations();
    this.patrol();
    // this.healthBar.setPercentage(this.energy);
  }

  handleAnimations() {
    this.animate(LOADED_IMAGES.troll.walk);
  }

  getRandomTurnPoint(direction) {
    if (direction === "right") {
      return this.patrolMax - Math.random() * 150;
    } else {
      return this.patrolMin + Math.random() * 200;
    }
  }

  die() {
    if (this.isDeadAlready || !this.isDead()) return;
    this.playDeathAnimation(
      LOADED_IMAGES.troll.die,
      LOADED_SOUNDS.troll.die,
      null
    );
  }

  isHitBy(otherObject, otherOffset = null, myOffset = this.outerOffset) {
    const a = otherObject.getHitbox(otherOffset);
    const b = this.getHitbox(myOffset);

    return (  // Kollisionsprüfung (AABB – Axis-Aligned Bounding Box):
      a.x + a.width > b.x &&  //→ Rechte Seite von a ist rechts von der linken Seite von b.
      a.x < b.x + b.width &&  //→ Linke Seite von a ist links von der rechten Seite von b.
      a.y + a.height > b.y &&  //→ Untere Seite von a ist unterhalb der oberen Seite von b.
      a.y < b.y + b.height  //→ Obere Seite von a ist oberhalb der unteren Seite von b.
    );
  }

  patrol() {
    if (this.isDead()) return;
    if (!this.otherDirection) {
      this.moveLeft();
      if (this.x <= this.nextTurnPoint) {
        this.otherDirection = true;
        this.nextTurnPoint = this.getRandomTurnPoint("right");
      }
    } else {
      this.moveRight();
      if (this.x >= this.nextTurnPoint) {
        this.otherDirection = false;
        this.nextTurnPoint = this.getRandomTurnPoint("left");
      }
    }
  }

  drawInnerFrame() {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "orchid";
    ctx.lineWidth = 2;

    const innerOffsetX = this.x + this.innerOffset.left;
    const innerOffsetY = this.y + this.innerOffset.top;
    const innerOffsetWidth =
      this.width - this.innerOffset.left - this.innerOffset.right;
    const innerOffsetHeight =
      this.height - this.innerOffset.top - this.innerOffset.bottom;

    ctx.strokeRect(
      innerOffsetX,
      innerOffsetY,
      innerOffsetWidth,
      innerOffsetHeight
    );
  }

  drawOuterFrame() {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "royalblue";
    ctx.lineWidth = 2;

    const outerOffsetX = this.x + this.outerOffset.left;
    const outerOffsetY = this.y + this.outerOffset.top;
    const outerOffsetWidth =
      this.width - this.outerOffset.left - this.outerOffset.right;
    const outerOffsetHeight =
      this.height - this.outerOffset.top - this.outerOffset.bottom;

    ctx.strokeRect(
      outerOffsetX,
      outerOffsetY,
      outerOffsetWidth,
      outerOffsetHeight
    );
  }
}
