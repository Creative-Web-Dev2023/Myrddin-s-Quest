class Character extends MovableObject {
  height = 290;
  width = 520;
  x = 130;
  y = 150; // Stellen Sie sicher, dass dies eine angemessene Höhe ist
  speed = 5;
  coins = 0;
  coinStatusBar;
  invulnerable = false;
  poisonCollected = 0; // Gift gesammelt
  poisonStatusBar; // Füge die PoisonStatusBar hinzu
  deadAnimationPlayed = false; // Füge eine neue Eigenschaft hinzu, um zu verfolgen, ob die Dead-Animation abgespielt wurde
  hasKey = false; // Neue Eigenschaft, um zu verfolgen, ob der Charakter einen Schlüssel hat
  isVisible = true; // Standardmäßig sichtbar

  offset = {
    top: 50, // Reduziert das Rechteck von oben
    bottom: 10, // Reduziert das Rechteck von unten
    left: 200, // Reduziert das Rechteck von links
    right: 200, // Reduziert das Rechteck von rechts
  };

  IMAGES_IDLE = [
    "img/wizard/idle/idle_000.png",
    "img/wizard/idle/idle_001.png",
    "img/wizard/idle/idle_002.png",
    "img/wizard/idle/idle_003.png",
    "img/wizard/idle/idle_004.png",
    "img/wizard/idle/idle_005.png",
    "img/wizard/idle/idle_006.png",
    "img/wizard/idle/idle_007.png",
    "img/wizard/idle/idle_008.png",
    "img/wizard/idle/idle_009.png",
  ];

  IMAGES_WALKING = [
    "img/wizard/walk/walk_001.png",
    "img/wizard/walk/walk_002.png",
    "img/wizard/walk/walk_003.png",
    "img/wizard/walk/walk_004.png",
    "img/wizard/walk/walk_005.png",
    "img/wizard/walk/walk_006.png",
    "img/wizard/walk/walk_007.png",
    "img/wizard/walk/walk_008.png",
    "img/wizard/walk/walk_009.png",
  ];

  IMAGES_JUMPING = [
    "img/wizard/jump/jump_000.png",
    "img/wizard/jump/jump_001.png",
    "img/wizard/jump/jump_002.png",
    "img/wizard/jump/jump_003.png",
    "img/wizard/jump/jump_004.png",
    "img/wizard/jump/jump_005.png",
    "img/wizard/jump/jump_006.png",
    "img/wizard/jump/jump_007.png",
    "img/wizard/jump/jump_008.png",
    "img/wizard/jump/jump_009.png",
  ];
  IMAGES_ATTACK = [
    "img/wizard/attack/Attack1.png",
    "img/wizard/attack/Attack2.png",
    "img/wizard/attack/Attack3.png",
    "img/wizard/attack/Attack4.png",
    "img/wizard/attack/Attack5.png",
    "img/wizard/attack/Attack6.png",
    "img/wizard/attack/Attack7.png",
  ];
  IMAGES_DEAD = [
    "img/wizard/die/die_000.png",
    "img/wizard/die/die_001.png",
    "img/wizard/die/die_002.png",
    "img/wizard/die/die_003.png",
    "img/wizard/die/die_004.png",
    "img/wizard/die/die_005.png",
    "img/wizard/die/die_006.png",
    "img/wizard/die/die_007.png",
    "img/wizard/die/die_008.png",
    "img/wizard/die/die_009.png",
  ];

  IMAGES_HURT = [
    "img/wizard/hurt/hurt_000.png",
    "img/wizard/hurt/hurt_001.png",
    "img/wizard/hurt/hurt_002.png",
    "img/wizard/hurt/hurt_003.png",
    "img/wizard/hurt/hurt_004.png",
    "img/wizard/hurt/hurt_005.png",
    "img/wizard/hurt/hurt_006.png",
    "img/wizard/hurt/hurt_007.png",
    "img/wizard/hurt/hurt_008.png",
    "img/wizard/hurt/hurt_009.png",
  ];
  IMAGES_FIRE_ATTACK = [
    "img/wizard/fire/fire1.png",
    "img/wizard/fire/fire2.png",
    "img/wizard/fire/fire3.png",
    "img/wizard/fire/fire4.png",
    "img/wizard/fire/fire5.png",
    "img/wizard/fire/fire6.png",
    "img/wizard/fire/fire7.png",
    "img/wizard/fire/fire8.png",
    "img/wizard/fire/fire9.png",
    "img/wizard/fire/fire10.png",
  ];
  world = {};
  constructor(world, coinStatusBar, poisonStatusBar) {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_FIRE_ATTACK);
    this.world = world || {}; // Ensure world is initialized
    this.coinsCollected = 0; // Münzen gesammelt
    this.applyGravity();
    this.energy = 100; // Setzt die Energie zu Beginn des Spiels auf 100
    this.playAnimation(this.IMAGES_IDLE);
    this.animate();
    this.coinStatusBar = coinStatusBar || new CoinStatusBar(); // Statusleiste für Münzen
    this.coinStatusBar.setPercentage(0); // Initialize coin status bar to 0%
    this.poisonStatusBar = poisonStatusBar || new PoisonStatusbar(); // Statusleiste für Gift
    this.poisonStatusBar.setPercentage(0); // Initialize poison status bar to 0%
    this.healthBar = new StatusBar(); // Füge eine Statusleiste für den Charakter hinzu
    this.healthBar.setPercentage(this.energy); // Setze die Energie der Statusleiste
    this.statusBar = new StatusBar();
    this.loadImages(this.IMAGES_YOU_LOST);
    this.world.camera_x = -this.x - 190; // Setze die Kamera auf die Anfangsposition des Charakters
  }

  throwObject() {
    if (this.world && this.world.throwableObjects) {
      const throwableObject = new ThrowableObject(this.x + this.width / 2, this.y + this.height / 2);
      this.world.throwableObjects.push(throwableObject);
      playPoisonBottleSound(); // Spiele den Sound ab, wenn die Flasche geworfen wird
    } else {
      console.error('throwableObjects array is not initialized in the world');
    }
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (this.isDead()) {
        this.handleDeadAnimation();
      } else if (this.world.keyboard && this.world.keyboard.THROW) {
        this.playAnimationWithSound(this.IMAGES_FIRE_ATTACK, fireAttackSound);
      } else if (this.world.keyboard && this.world.keyboard.ATTACK) {
        this.playAnimationWithSound(this.IMAGES_ATTACK, attackSound);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (this.world.keyboard && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
        this.playAnimationWithSound(this.IMAGES_WALKING, walkingSound);
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }, 100); // 100 ms zwischen den Frames für eine flüssige Animation
  }

  playAnimationWithSound(images, sound) {
    this.playAnimation(images);
    if (sound.paused) {
      sound.play();
    }
  }

  handleDeadAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    if (this.currentImage >= this.IMAGES_DEAD.length - 1) {
      clearInterval(this.animationInterval); // Stop animation only after the death animation is complete
      if (this.world.endGame) {
        this.world.endGame.showYouLostScreen(); // Verwenden Sie die Methode aus der EndGame-Klasse
      }
    }
  }
  update() {
    if (!this.isDead()) {
      walkingSound.pause();
      if (this.world.keyboard && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { 
        this.moveRight();
        this.otherDirection = false;
        playWalkingSound();
      }
      if (this.world.keyboard && this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        playWalkingSound();
      }
      if (this.world.keyboard && this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }
      this.world.camera_x = -this.x - 190;
      this.checkCollisions();
    }
  }
  checkCollisions() {
    this.world.coinsArray.forEach((coin, index) => {
      if (this.isColliding(coin)) {
        this.collectCoins(); // Münzen sammeln
        this.world.coinsArray.splice(index, 1); // Entferne die Münze aus dem Array
      }
    });
    Door.checkCharacterNearDoor(this.world); // Überprüfe, ob der Charakter die Tür betritt
    this.collectPoison();
    this.collectKey(); // Überprüfe, ob der Charakter einen Schlüssel einsammelt
    this.checkJumpOnKnight();
    this.checkKnightAttack();
   
  }
  collectPoison() {
    if (this.world.poisonsArray) {
      this.world.poisonsArray.forEach((poison, index) => {
        if (this.isColliding(poison)) {
          poison.deactivate();
          this.poisonCollected += 1; // Erhöhe die gesammelten Giftflaschen
          this.poisonStatusBar.setPercentage(this.poisonCollected * 20); // Update die Statusleiste
          this.world.poisonsArray.splice(index, 1); // Entferne das Giftobjekt aus dem Array
        }
      });
    }
  }
  collectCoins() {
    this.coinsCollected++; // Erhöhe die gesammelten Münzen
    this.coinStatusBar.setPercentage(this.coinsCollected); // Aktualisiere die Statusleiste
    playCollectCoinSound(); // Spiele den Münz-Sound ab
  }


  collectKey() {
    if (this.world.keysArray) {
      this.world.keysArray.forEach((key, index) => {
        if (this.isColliding(key)) {
          this.hasKey = true; // Setze hasKey auf true, wenn der Charakter einen Schlüssel einsammelt
          this.world.keysArray.splice(index, 1); // Entferne den Schlüssel aus dem Array
        }
      });
    }
  }

  jump() {
    this.speedY = 33; // Die Geschwindigkeit des Sprungs
    playJumpSound(); // Spiele den Sprung-Sound ab
  }

  checkCollision(coin) {
    const characterHitbox = {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom
    };

    return (
      characterHitbox.x < coin.x + coin.width &&
      characterHitbox.x + characterHitbox.width > coin.x &&
      characterHitbox.y < coin.y + coin.height &&
      characterHitbox.y + characterHitbox.height > coin.y
    );
  }

  attackEndboss(endboss) {
    if (this.world.keyboard && this.world.keyboard.THROW) {
      this.playAnimation(this.IMAGES_FIRE_ATTACK);
      if (fireAttackSound.paused) {
        playFireAttackSound(); // Spiele den Angriffssound ab
      }
      endboss.energy -= 20; // Verringere die Energie des Endbosses
      if (endboss.energy <= 0) {
        endboss.energy = 0;
        endboss.isDead = true;
        endboss.playAnimation(endboss.IMAGES_DEAD);
        setTimeout(() => {
          this.world.level.endboss = null; // Entferne den Endboss aus der Welt
        }, 2000);
      } else {
        endboss.playAnimation(endboss.IMAGES_HURT);
      }
    }
  }
  checkCollisionWithPoison() {
    if (this.world.poisonsArray) { // Überprüfe, ob es Giftobjekte gibt
      this.world.poisonsArray.forEach((poison) => {
        if (poison.isActive && this.checkCollision(poison)) {
          poison.deactivate(); // Giftflasche deaktivieren
          this.poisonCollected += 1; // Sammelzähler für Gift erhöhen
          this.poisonStatusBar.setPercentage(this.poisonCollected * 20); // Statusleiste aktualisieren
        }
      });
    }
  }

  isAboveGround() {
    return this.y < 150; // Passen Sie dies an die tatsächliche Bodenhöhe an
  }

  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT; // Prüfen, ob die Pfeiltasten für Bewegung gedrückt sind
  }
  hit(enemy) {
    const distance = Math.abs(this.x - enemy.x); // Berechne den Abstand zwischen Charakter und Feind
    if (!this.invulnerable && distance < 100) { // Wenn der Charakter nicht unverwundbar ist und der Abstand kleiner als 100 ist
      this.energy -= 5; // Verringere die Energie bei einem Treffer
      if (this.energy <= 0) {
        this.energy = 0; // Energie kann nicht unter 0 fallen
      }
      this.healthBar.setPercentage(this.energy); // Aktualisiere die Statusleiste des Charakters
      this.invulnerable = true; // Setze den Charakter für eine kurze Zeit unverwundbar
      setTimeout(() => {
        this.invulnerable = false; // Nach 1 Sekunde wieder verwundbar machen
      }, 1000);
    }
  }
  isHurt() {
    return this.energy < 100 && this.energy > 0; // wenn seine < 100 und > 0 ist, dann ist er verletzt
  }
  isDead() {
    return this.energy == 0;// wenn seine Energie 0 ist, dann ist er tot
  }

  checkJumpOnKnight() {
    let nearestKnight = null;
    let minDistance = Infinity;

    this.world.enemies.forEach((enemy, index) => {
      if (enemy instanceof Knight && this.isColliding(enemy) && this.speedY < 0) {
        const distance = Math.abs(this.x - enemy.x);
        if (distance < minDistance) {
          minDistance = distance;
          nearestKnight = { enemy, index };
        }
      }
    });

    if (nearestKnight) {
      nearestKnight.enemy.die(); // Set knight to dead state
      this.world.enemies.splice(nearestKnight.index, 1); // Remove knight from enemies array
    }
  }

  checkKnightAttack() {
    this.world.enemies.forEach((enemy) => {
      if (enemy instanceof Knight) {
        const distance = Math.abs(this.x - enemy.x); // Berechne die Distanz

        // Überprüfen, ob der Charakter nah genug ist und nicht in der Luft
        if (distance <= 100 && !this.isAboveGround()) {
          enemy.isAttacking = true; // Setze den Angriffsstatus des Ritters auf true
          enemy.playAnimation(enemy.IMAGES_ATTACKING); // Ritter spielt Angriffsanimation

          setTimeout(() => {
            const updatedDistance = Math.abs(this.x - enemy.x); // Aktualisiere die Distanz

            // Angriff nur, wenn der Charakter immer noch nah genug ist und am Boden
            if (!this.isAboveGround() && updatedDistance <= 100) {
              this.hit(enemy); // Ritter greift an
            }
          }, 500); // Verzögerung des Angriffs um 500 ms
        } else {
          enemy.isAttacking = false; // Setze den Angriffsstatus des Ritters zurück
        }
      }
    });
  }

  reset() {
    this.x = 130;
    this.y = 150;
    this.energy = 100;
    this.coinsCollected = 0;
    this.poisonCollected = 0;
    this.coinStatusBar.setPercentage(0);
    this.poisonStatusBar.setPercentage(0);
    this.healthBar.setPercentage(this.energy);
    this.playAnimation(this.IMAGES_IDLE);
    this.animate();
  }

  draw(ctx) {
    if (!this.isVisible) return; // Nicht zeichnen, wenn unsichtbar
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    this.coinStatusBar.draw(ctx);
    this.poisonStatusBar.draw(ctx);
    this.healthBar.draw(ctx);
  }
}
