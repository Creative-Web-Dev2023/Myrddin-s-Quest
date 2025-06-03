class Endboss extends MovableObject {
  innerOffset = { top: 10, bottom: 100, left: 250, right: 180 };
  outerOffset = { top: 10, bottom: 100, left: 40, right: 50 };
  constructor() {
    super();
    this.addToImageCache('walk', LOADED_IMAGES.troll.walk);
    this.addToImageCache('hurt', LOADED_IMAGES.troll.hurt);
    this.addToImageCache('dead', LOADED_IMAGES.troll.die);
    this.img = this.imageCache['walk_0'];
    this.deadAnimationPlayed = false;
    this.height = 409;
    this.width = 700;
    this.y = 100;
    this.x = 5500;
    this.speed = 2;
    this.energy = 100;
    this.healthBar;
    this.isDeadAlready = false;
    this.patrolMin = 5000;
    this.patrolMax = 5800;
    this.nextTurnPoint = this.getRandomTurnPoint('left');
    this.isTriggered = false;
    this.isAnimating = false;
  }

  update() {
    if (this.isDeadAlready) return;
    this.handleAnimations();
    if (this.isTriggered) {
      this.chasePlayer();
    } else {
      this.patrol();
    }
    this.healthBar.setPercentage(this.energy);
  }

  handleAnimations() {
    if (this.isAnimating) return;
    this.animate(LOADED_IMAGES.troll.walk);
    this.getTriggerZone();
  }

  getTriggerZone() {
    return {
      x: this.x - 300,
      y: this.y,
      width: 300,
      height: this.height,
    };
  }

  getRandomTurnPoint(direction) {
    if (direction === 'right') {
      return this.patrolMax - Math.random() * 150;
    } else {
      return this.patrolMin + Math.random() * 200;
    }
  }

  patrol() {
    if (this.isDead()) return;
    if (!this.otherDirection) {
      this.moveLeft();
      if (this.x <= this.nextTurnPoint) {
        this.otherDirection = true;
        this.nextTurnPoint = this.getRandomTurnPoint('right');
      }
    } else {
      this.moveRight();
      if (this.x >= this.nextTurnPoint) {
        this.otherDirection = false;
        this.nextTurnPoint = this.getRandomTurnPoint('left');
      }
    }
  }

  chasePlayer() {
    this.otherDirection = false;
    console.log('Troll greift an: ', LOADED_IMAGES.troll.attack);
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.playAnimationOnce(LOADED_IMAGES.troll.attack, () => {
        this.isAnimating = false;
      });
    }
    // this.playSound(LOADED_SOUNDS.troll.hurt);
    console.log('Troll reagiert auf den Zauberer!');
    this.moveLeft();
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
    return (
      a.x + a.width > b.x &&
      a.x < b.x + b.width &&
      a.y + a.height > b.y &&
      a.y < b.y + b.height
    );
  }

  drawTriggerZone(ctx) {
    const zone = this.getTriggerZone();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'orchid';
    ctx.lineWidth = 2;
    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
  }
}