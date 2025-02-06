class Endboss extends Enemy {
  constructor(id) {
    super(id);
    this.height = 450; 
    this.width = 360; 
    this.y = 50; 
    this.x = 13250;
    this.attackRange = 200; 
    this.attackDamage = 20; 
    this.speed = 0.5;
    this.deadSound = new Audio("audio/troll dead.mp3");
    this.offset = { top: 50, bottom: 20, left: 20, right: 20 };
    this.statusBarEndboss = new EndbossStatusbar(); 
    this.otherDirection = true; 
    this.energy = 100; 
    this.statusBarEndboss.setPercentage(this.energy); 
    this.IMAGES_WALKING = [
      'img/troll/walk/walk_000.png',
      'img/troll/walk/walk_001.png',
      'img/troll/walk/walk_002.png',
      'img/troll/walk/walk_003.png',
      'img/troll/walk/walk_004.png',
      'img/troll/walk/walk_005.png',
      'img/troll/walk/walk_006.png',
      'img/troll/walk/walk_007.png',
      'img/troll/walk/walk_008.png',
      'img/troll/walk/walk_009.png',
    ];
    this.IMAGES_ATTACKING = [
      "img/troll/attack/attack_000.png",
      "img/troll/attack/attack_001.png",
      "img/troll/attack/attack_002.png",
      "img/troll/attack/attack_003.png",
      "img/troll/attack/attack_004.png",
      "img/troll/attack/attack_005.png",
      "img/troll/attack/attack_006.png",
      "img/troll/attack/attack_007.png",
      "img/troll/attack/attack_008.png",
      "img/troll/attack/attack_009.png",
    ];
    this.IMAGES_HURT = [
      "img/troll/hurt/hurt_000.png",
      "img/troll/hurt/hurt_001.png",
      "img/troll/hurt/hurt_002.png",
      "img/troll/hurt/hurt_003.png",
      "img/troll/hurt/hurt_004.png",
      "img/troll/hurt/hurt_005.png",
      "img/troll/hurt/hurt_006.png",
      "img/troll/hurt/hurt_007.png",
      "img/troll/hurt/hurt_008.png",
      "img/troll/hurt/hurt_009.png",
    ];
    this.IMAGES_DEAD = [
      "img/troll/die/die_000.png",
      "img/troll/die/die_001.png",
      "img/troll/die/die_002.png",
      "img/troll/die/die_003.png",
      "img/troll/die/die_004.png",
      "img/troll/die/die_005.png",
      "img/troll/die/die_006.png",
      "img/troll/die/die_007.png",
      "img/troll/die/die_008.png",
      "img/troll/die/die_009.png",
    ];
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animateWalking();
    this.guardRange = { left: 13000, right: 13500 }; 
    this.patrolSpeed = 1.2;
    this.isGuarding = true;
    this.patrolRange = 100;
    this.startX = this.x;
  }

  setWorld(world) {
    this.world = world;
  }

  playDeadSound() {
    this.deadSound.play();
  }

  takeDamage(damage) {
    if (this.dead || this.isHurt) return; 
    this.isHurt = true;
    this.energy = Math.max(0, this.energy - damage);
    this.statusBarEndboss.setPercentage(this.energy);
    if (this.energy <= 0) {
        this.handleDeath();
    } else {
        this.playHurtAnimation();
        setTimeout(() => {
            this.isHurt = false;
        }, 500); 
    }
}

playHurtAnimation() {
  clearInterval(this.animationInterval);
  this.currentAnimation = this.IMAGES_HURT;
  this.currentImage = 0;

  this.animationInterval = setInterval(() => {
      if (this.currentImage < this.IMAGES_HURT.length) {
          this.img = this.imageCache[this.IMAGES_HURT[this.currentImage]];
          this.currentImage++;
      } else {
          clearInterval(this.animationInterval);
          this.isHurt = false;
          this.animateWalking();
      }
  }, 100);
}

handleDeath() {
  clearInterval(this.animationInterval);
  this.dead = true;
  this.currentAnimation = this.IMAGES_DEAD;
  this.currentImage = 0;

  this.animationInterval = setInterval(() => {
      if (this.currentImage < this.IMAGES_DEAD.length) {
          this.img = this.imageCache[this.IMAGES_DEAD[this.currentImage]];
          this.currentImage++;
      } else {
          clearInterval(this.animationInterval);
          setTimeout(() => {
              this.isVisible = false;
              this.world.showVictoryScreen();
          }, 1000);
      }
  }, 150);
}


  die() {
    if (!this.dead) {
        super.die();
        this.spawnCrystal();
        setTimeout(() => this.isVisible = false, 2000);
    }
  }

  spawnCrystal() {
    const crystal = new Crystal(
        this.x + this.width/2 - 40,
        this.y + this.height/2 - 40
    );
    this.world.level.objects.push(crystal);
    this.world.crystal = crystal;
  }

  update(character) {
    if (this.isDead()) return;
    
    if (this.isInAttackRange(character)) {
        this.playAttackAnimation();
    } else {
        this.patrol();
    }
    
    this.statusBarEndboss.setPercentage(this.energy);
  }

  patrol() {
    if (this.x <= this.startX - this.patrolRange) {
        this.otherDirection = false;
    } else if (this.x >= this.startX + this.patrolRange) {
        this.otherDirection = true;
    }
    this.x += this.otherDirection ? -this.speed : this.speed;
  }

  draw(ctx) {
    if (this.img && this.img.complete) {
        this.drawEndboss(ctx);
        this.updateStatusBarPosition();
        this.statusBarEndboss.setPercentage(this.energy);
        this.statusBarEndboss.draw(ctx);
    }
  }

  drawEndboss(ctx) {
    if (this.otherDirection) {
        ctx.save();
        ctx.translate(this.x + this.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, this.y, this.width, this.height);
        ctx.restore();
    } else {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  updateStatusBarPosition() {
    this.statusBarEndboss.x = this.x + this.width / 2 - this.statusBarEndboss.width / 2;
    this.statusBarEndboss.y = this.y - this.statusBarEndboss.height + 20;
  }
  
    updateEndbossHealth(damage) {
    if (this.world.endboss) {
      this.world.endboss.takeDamage(damage);
    }
  }

  animateWalking() {
    if(this.dead || this.isHurt) return;
    
    clearInterval(this.animationInterval);
    this.animationInterval = setInterval(() => {
        this.playAnimation(this.IMAGES_WALKING);
    }, 150);
  }

playAnimation(images) {
    if (this.currentImage >= images.length) {
        this.currentImage = 0; 
    }
    this.img = this.imageCache[images[this.currentImage]];
    this.currentImage++;
}

playAttackAnimation() {
    clearInterval(this.animationInterval);
    this.currentImage = 0;
    
    this.animationInterval = setInterval(() => {
        if (this.currentImage < this.IMAGES_ATTACKING.length) {
            this.img = this.imageCache[this.IMAGES_ATTACKING[this.currentImage]];
            this.currentImage++;
        } else {
            this.currentImage = 0;
        }
    }, 100);
}

isInAttackRange(character) {
    return Math.abs(this.x - character.x) < this.attackRange;
}

}