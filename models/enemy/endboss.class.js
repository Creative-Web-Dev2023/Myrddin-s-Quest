class Endboss extends Enemy {
  constructor(id) {
    super(id);
    this.height = 450; // Größere Höhe
    this.width = 360; 
    this.y = 50; 
    this.x = 13250;
    this.attackRange = 200; 
    this.attackDamage = 20; 
    this.speed = 5;
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
    this.guardRange = { left: 13000, right: 13500 }; // 500px Bereich
    this.patrolSpeed = 1.2;
    this.isGuarding = true;
  }

  setWorld(world) {
    this.world = world;
  }

  playDeadSound() {
    this.deadSound.play();
  }

  checkForAttack(character) {
    const endbossBox = this.getCollisionBox();
    const characterBox = character.getCollisionBox();
    const attackBox = {
      x: endbossBox.x - this.attackRange,
      y: endbossBox.y,
      width: this.attackRange * 2,
      height: endbossBox.height,
    };
    const isInAttackRange =
      attackBox.x < characterBox.x + characterBox.width &&
      attackBox.x + attackBox.width > characterBox.x &&
      attackBox.y < characterBox.y + characterBox.height &&
      attackBox.y + attackBox.height > characterBox.y;
    if (isInAttackRange && !this.isAttacking) {
      this.attack(character);
    }
  }
  
  attack(character) {
    if(this.isDead()) return;
    this.isAttacking = true;
    this.playAnimation(this.IMAGES_ATTACKING);
    const attackBox = {
        x: this.otherDirection ? this.x - 150 : this.x + this.width,
        y: this.y + 50,
        width: 150,
        height: this.height - 100
    };

    setTimeout(() => {
        if(this.checkCollisionWithAttackBox(character, attackBox)) {
            character.takeDamage(this.attackDamage);
        }
        this.isAttacking = false;
    }, 500);
}

  takeDamage(damage) {
    if (!this.dead) {
        this.energy = Math.max(this.energy - damage, 0);
        this.statusBarEndboss.setPercentage(Math.floor(this.energy / 20) * 20);
        console.log("Endboss Health:", this.energy);
        if (this.energy <= 0) {
            this.die();
        }
    }
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
    
    if (this.checkCharacterCollision(character)) {
        this.handleAttack(character);
    } else {
        this.patrol();
    }
    this.statusBarEndboss.setPercentage(this.energy); 
  }

  patrol() {
    if (!this.isGuarding || this.isAttacking) return;

    // Sanfte Richtungsänderung
    if (this.x <= this.guardRange.left) {
        this.otherDirection = false;
        this.patrolSpeed = Math.abs(this.patrolSpeed);
    } else if (this.x >= this.guardRange.right) {
        this.otherDirection = true;
        this.patrolSpeed = -Math.abs(this.patrolSpeed); 
    }
  
    this.x += this.patrolSpeed;

    if (this.patrolSpeed > 0) {
        this.otherDirection = false;
    } else {
        this.otherDirection = true;
    }
  }

  checkCharacterCollision(character) {
    const bossBox = this.getCollisionBox();
    const charBox = character.getCollisionBox();
    return this.checkBoxCollision(bossBox, charBox);
  }

  handleAttack(character) {
    this.patrolSpeed = 0; 
    this.attack(character);
    setTimeout(() => {
        this.patrolSpeed = 1.5; 
    }, 2000);
  }

  moveTowardsCharacter(character) {
    if(this.isDead()) return;
    const speed = this.dead ? 0 : 3;
    if(this.x < character.x) {
        this.x += speed;
        this.otherDirection = false;
    } else {
        this.x -= speed;
        this.otherDirection = true;
    }
}
  draw(ctx) {
    if (this.img && this.img.complete) {
        if (this.otherDirection) {
            ctx.save();
            ctx.translate(this.x + this.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, 0, this.y, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        this.statusBarEndboss.x = this.x + this.width / 2 - this.statusBarEndboss.width / 2; 
        this.statusBarEndboss.y = this.y - this.statusBarEndboss.height + 20; 
        this.statusBarEndboss.setPercentage(this.energy);
        this.statusBarEndboss.draw(ctx);
    }
    
    // Debug-Anzeige
    ctx.fillStyle = 'rgba(0,255,0,0.3)';
    ctx.fillText(`Pos: ${Math.round(this.x)} | Speed: ${this.patrolSpeed.toFixed(1)}`, this.x - 100, this.y - 20);
  }
    updateEndbossHealth(damage) {
    if (this.world.endboss) {
      this.world.endboss.takeDamage(damage);
    }
  }

  checkCollisionWithAttackBox(character, attackBox) {
    const charBox = character.getCollisionBox();
    return this.checkBoxCollision(attackBox, charBox);
  }

  checkBoxCollision(box1, box2) {
    return box1.x < box2.x + box2.width &&
           box1.x + box1.width > box2.x &&
           box1.y < box2.y + box2.height &&
           box1.y + box1.height > box2.y;
  }

  animateWalking() {
    setInterval(() => {
        if (this.isGuarding && !this.isAttacking && !this.isDead()) {
            this.playAnimation(this.IMAGES_WALKING);
            this.currentImage %= this.IMAGES_WALKING.length;
        }
    }, 150);
  }

}