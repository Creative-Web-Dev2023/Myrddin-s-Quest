class Character extends MovableObject {
  height = 290;
  width = 520;
  x = 130;
  y = 150; // Stellen Sie sicher, dass dies eine angemessene Höhe ist
  speed = 5;
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
  IMAGES_YOU_LOST = [
    "img/game_ui/login&pass/game_over.png",
  ];
  world = {};
  constructor(world,poisonStatusBar) {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_FIRE_ATTACK);
    this.world = world || {}; // Ensure world is initialized
    this.applyGravity();
    this.energy = 100; // Setzt die Energie zu Beginn des Spiels auf 100
    this.playAnimation(this.IMAGES_IDLE);
    this.animate(); // Aufruf der geerbten Methode animate
    this.poisonStatusBar = poisonStatusBar || new PoisonStatusBar(); 
    this.poisonStatusBar.setPercentage(0); 
    this.CharacterHealthBar = new StatusBar(); // Füge eine Statusleiste für den Charakter hinzu
    this.CharacterHealthBar.setPercentage(this.energy); // Setze die Energie der Statusleiste
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

  update() {
    if (!this.isVisible) return; // Wenn der Charakter unsichtbar ist, keine Updates ausführen
    if (!this.isDead()) {
      walkingSound.pause();
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { 
        this.moveRight();
        this.otherDirection = false;
        playWalkingSound();
      }
      if ( this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        playWalkingSound();
      }
      if (this.world.keyboard.JUMP && !this.isAboveGround()) {
        this.jump();
      }
      this.world.camera_x = -this.x - 190;
      this.checkCollisions();
    }
  }
  checkCollisions() {
    CollisionUtils.checkCollisionWithObjects(this, this.world.poisonsArray, this.collectPoison.bind(this));
    CollisionUtils.checkCollisionWithObjects(this, this.world.keysArray, this.collectKey.bind(this));
    Door.checkCharacterNearDoor(this.world); // Überprüfe, ob der Charakter die Tür betritt
    this.checkJumpOnKnight();
    this.checkKnightAttack();
  }

  checkCollisionWithObjects(objectsArray, callback) {
    objectsArray.forEach((object, index) => {
      if (this.isColliding(object)) {
        callback(object, index);
      }
    });
  }

  collectPoison(poison, index) {
    if (poison && poison.isActive) {
      poison.deactivate(); // Deaktivieren der Giftflasche
      this.poisonCollected += 1; // Erhöhe die gesammelten Giftflaschen
      this.poisonStatusBar.setPercentage(this.poisonCollected * 20); // Update die Statusleiste
      this.world.poisonsArray.splice(index, 1); // Entferne das Giftobjekt aus dem Array
    }
  }


  

  collectKey(key, index) {
    this.hasKey = true; // Setze hasKey auf true, wenn der Charakter einen Schlüssel einsammelt
    this.world.keysArray.splice(index, 1); // Entferne den Schlüssel aus dem Array
  }

  jump() {
    this.speedY = 33; // Die Geschwindigkeit des Sprungs
    playJumpSound(); // Spiele den Sprung-Sound ab
  }

  attackEndboss(endboss) {
    if (this.world.keyboard && this.world.keyboard.THROW) {
      if (!this.isAttacking) { // Überprüfe, ob der Charakter bereits angreift
        this.isAttacking = true;
        this.playAnimation(this.IMAGES_FIRE_ATTACK);
        playFireAttackSound(); // Spiele den Angriffssound ab

        setTimeout(() => {
          endboss.energy -= 20; // Verringere die Energie des Endbosses
          if (endboss.energy <= 0) {
            endboss.energy = 0;
            endboss.isDead = true;
            endboss.playAnimation(endboss.IMAGES_DEAD);
            setTimeout(() => {
              this.world.level.endboss = null; // Entferne den Endboss
            }, 2000);
          } else {
            endboss.playAnimation(endboss.IMAGES_HURT);
          }
          this.isAttacking = false; // Angriff abgeschlossen
        }, 500); // Verzögerung der Schadensberechnung
      }
    }
  }

  attackKnight(knight) {
    if (this.world.keyboard && this.world.keyboard.ATTACK) {
      if (!this.isAttacking) { // Überprüfe, ob der Charakter bereits angreift
        this.isAttacking = true;
        this.playAnimation(this.IMAGES_ATTACK);
        playAttackSound(); // Spiele den Angriffssound ab

        setTimeout(() => {
          knight.hit(2); // Reduzieren Sie den Schaden, den der Ritter erleidet
          this.isAttacking = false; // Angriff abgeschlossen
        }, 1000); // Erhöhen Sie die Verzögerung der Schadensberechnung
      }
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
      this.CharacterHealthBar.setPercentage(this.energy); // Aktualisiere die Statusleiste des Charakters
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

    if (nearestKnight && !nearestKnight.enemy.isDead) {
      nearestKnight.enemy.isDead = true; // Markiere den Ritter als tot
      nearestKnight.enemy.playAnimation(nearestKnight.enemy.IMAGES_HURT); // Spiele die Hurt-Animation
      setTimeout(() => {
        nearestKnight.enemy.playAnimation(nearestKnight.enemy.IMAGES_DEAD); // Spiele die Dead-Animation
        setTimeout(() => {
          this.world.enemies.splice(nearestKnight.index, 1); // Entferne den Ritter
        }, 3000); // Warte 3 Sekunden, bevor der Ritter verschwindet
      }, 1000); // Warte 1 Sekunde, bevor die Dead-Animation abgespielt wird
    }
  }
  

  checkKnightAttack() {
    this.world.enemies.forEach((enemy) => {
      if (enemy instanceof Knight) {
        const distance = Math.abs(this.x - enemy.x); // Calculate distance between character and knight
        if (distance <= 100 && !this.isAboveGround()) {
          enemy.isAttacking = true; // Set knight's attacking status to true
          enemy.playAnimation(enemy.IMAGES_ATTACKING); // Knight plays attacking animation
          setTimeout(() => {
            // Attack only if the character is still close enough and on the ground
            if (!this.isAboveGround() && this.isColliding(enemy)) {
              this.hit(enemy); // Knight attacks
            }
          }, 1000); // Delay the attack by 1000 ms
        } else {
          enemy.isAttacking = false; // Reset knight's attacking status
        }
      }
    });
  }

  reset(level) {
    this.x = 130;
    this.y = 150;
    this.isVisible = true;
    if (level === 2) {
      this.energy = 100; // Optionale Anpassung für Level 2
    }
    this.poisonCollected = 0;
    this.poisonStatusBar.setPercentage(0);
    this.CharacterHealthBar.setPercentage(this.energy);
    this.playAnimation(this.IMAGES_IDLE);
    this.animate();
  }

  draw(ctx) {
    if (!this.isVisible) return; // Nicht zeichnen, wenn unsichtbar
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    this.poisonStatusBar.draw(ctx);
    this.CharacterHealthBar.draw(ctx);
  }

  enterDoor() {
    this.isVisible = false; // Charakter unsichtbar machen
    setTimeout(() => {
      this.isVisible = true; // Charakter nach 2 Sekunden wieder sichtbar machen
    }, 2000);a
  }

  checkCollisionWithDoor(door) {
    return this.isColliding(door);
  }

  getCollisionBox() { //Character collision box
    const box = {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom,
    };
    // console.log('Character collision box:', box); // Debug-Ausgabe der Kollisionsbox
    return box;
  }
}
