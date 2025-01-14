class Character extends MovableObject {
  height = 290; // Set the character's height
  width = 520; // Set the character's width
  x = 130; // Set the character's initial x position
  y = 210; // Set the character's initial y position
  speed = 5; // Set the character's speed
  invulnerable = false; // Set the character's invulnerability status
  poisonCollected = 0; // Initialize the collected poison count
  poisonStatusBar; // Add the PoisonStatusBar
  deadAnimationPlayed = false; // Track if the dead animation has been played
  hasKey = false; // Track if the character has a key
  isVisible = true; // Set the character to be visible by default
  offset = {
    top: 50, // Weniger oben abschneiden
    bottom: 10, // Weniger unten abschneiden
    left: 210, // Weniger links abschneiden
    right: 200 // Weniger rechts abschneiden
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
    super();
    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_FIRE_ATTACK);
    this.world = world || {}; // Ensure world is initialized
    this.applyGravity();
    this.energy = 100; // Energie des Charakters
    this.playAnimation(this.IMAGES_IDLE);
    this.animate(); // Aufruf der geerbten Methode animate
    this.poisonStatusBar = poisonStatusBar || new PoisonStatusBar(); 
    this.poisonStatusBar.setPercentage(0); 
    this.statusBar = new StatusBar();
    this.loadImages(this.IMAGES_YOU_LOST);
    this.world.camera_x = -this.x - 190; // Setze die Kamera auf die Anfangsposition des Charakters
  }

  update() {
    if (!this.isVisible) return;
    if (this.energy > 0) {
      this.handleMovement();
      this.handleActions();
      this.updateCamera();
    }
  }

  handleMovement() {
    walkingSound.pause();
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      playWalkingSound();
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      playWalkingSound();
    }
    if (this.world.keyboard.JUMP && !this.isAboveGround()) {
      this.jump();
    }
  }
 
  handleActions() {
    if (this.world.keyboard.ATTACK) {
      console.log('ATTACK-Taste gedrückt');
      this.isAttacking = true;
      this.playAnimation(this.IMAGES_ATTACK); // Angriffsanimation abspielen
      this.attackEnemies();
    } else {
      this.isAttacking = false;
    }
    if (this.world.keyboard.THROW_FIRE) {
      console.log('THROW_FIRE-Taste gedrückt');
      this.playAnimation(this.IMAGES_FIRE_ATTACK);  // Schuss-Animation abspielen
      this.attackEnemies();  // Alle Feinde angreifen, wenn der Charakter schießt
      this.shoot();  // Aufruf der Schuss-Logik
    }
  }

  updateCamera() {
    this.world.camera_x = -this.x - 190;
  }

  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 33; // Set the jump speed
      playJumpSound(); // Play the jump sound
    }
  }

  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT; // Return true if the character is moving right or left
  }

  hit(enemy) {
    const distance = Math.abs(this.x - enemy.x);  // Calculate the distance between the character and the enemy
    if (!this.invulnerable && distance < 100) { // Check if the character is vulnerable and close enough to the enemy
      this.takeDamage(5);  // Reduce the damage amount
      this.world.characterStatusBar.setPercentage(this.energy); // Aktualisiere die Statusleiste direkt
      this.playAnimation(this.IMAGES_HURT); // Zeige Hurt-Animation
    }
  }

  takeDamage(damage) {
    if (this.energy > 0 && !this.invulnerable) { // Check if the character is alive and not invulnerable
      this.energy -= damage; // Reduce the energy of the character
      this.world.characterStatusBar.setPercentage(this.energy); // Aktualisiere die Statusleiste direkt
      this.playAnimation(this.IMAGES_HURT);
      this.updateStatusBar(); // Update the status bar

      if (this.energy <= 0) { // Check if the character has died
        this.energy = 0; // Set the energy to 0
        this.die(); // Character dies if energy is 0
      } else {
        this.invulnerable = true; // Make the character invulnerable for a short period
        setTimeout(() => {
          this.invulnerable = false; // Remove invulnerability after 2 seconds
        }, 2000);
      }
    } 
  }

  updateStatusBar() {
    if (this.world && this.world.statusBar) {
      this.world.statusBar.update(this.energy); // Update the status bar with the new energy
    }
  }

  reset(level) { // Reset the character's position and energy
    this.x = 130; // Set the character's x position
    this.y = 150; // Set the character's y position
    this.isVisible = true; // 
    if (level === 2) { // If the level is 2
      this.energy = 100; // Optionale Anpassung für Level 2
      this.world.level.level_end_x = 3500; // Verkürze die Länge des Levels 2
    } else {
      this.poisonCollected = 0; // Reset the poison collected
      this.poisonStatusBar.setPercentage(0); // Reset the poison status bar
    }
    this.CharacterHealthBar = new StatusBar(); // Füge eine Statusleiste für den Charakter hinzu
    this.CharacterHealthBar.setPercentage(this.energy); // Reset the character's health bar
    this.playAnimation(this.IMAGES_IDLE); // Play the idle animation
    this.animate(); // Start the animation
  }

  enterDoor(door) {
    this.visible = true; // Stelle sicher, dass der Charakter sichtbar ist, bevor er die Tür betritt

    // Setze die Position des Charakters direkt an die Tür
    this.x = door.x; // Setze die X-Position des Charakters auf die X-Position der Tür

    // Optional: Füge eine kurze Animation oder einen Effekt hinzu, um anzuzeigen, dass der Charakter die Tür betritt
    setTimeout(() => {
        this.visible = false; // Charakter unsichtbar machen
        this.x = door.x + door.width + 50; // Position auf der anderen Seite der Tür
        this.visible = true; // Charakter wieder sichtbar machen
        door.checkLevelCompletion(); // Überprüfe, ob der Level abgeschlossen ist
    }, 2000); // Warte 1 Sekunde, bevor der Charakter unsichtbar wird
  }
  

  checkCollisionWithDoor(door) {
    const charBox = this.getCollisionBox(); // Kollision des Charakters
    const doorBox = door.getCollisionBox(); // Kollision der Tür

    console.log("Character Box:", charBox); // Debugging-Log
    console.log("Door Box:", doorBox); // Debugging-Log

    return (
        charBox.x < doorBox.x + doorBox.width &&
        charBox.x + charBox.width > doorBox.x &&
        charBox.y < doorBox.y + doorBox.height &&
        charBox.y + charBox.height > doorBox.y
    );
  }
  

  collectPoison(poison, index) {
    if (poison && poison.isActive) { // If the poison object is active
      poison.deactivate(); // Deactivate the poison object
      this.poisonCollected += 1; // Increase the collected poison count
      this.poisonStatusBar.setPercentage(this.poisonCollected * 20); // Update the poison status bar
      this.world.poisonsArray.splice(index, 1); // Remove the poison object from the array
      playCollectPoisonBottleSound(); // Play the collect poison bottle sound
    }
  }
  collectKey(key) {
    if (key && key.isActive) { // If the key object is active
      key.deactivate(); // Deactivate the key object
      this.hasKey = true; // Set the character's hasKey property to true
    }
  }

  attackEnemies() {
    const attackRange = 150; // Definierter Angriffsradius
    console.log('attackEnemies aufgerufen');

    this.world.enemies.forEach(enemy => {
      if ((enemy instanceof Knight || enemy instanceof Snake || enemy instanceof Endboss) && !enemy.dead) {
        const distance = Math.sqrt(
          Math.pow(this.x + this.width / 2 - (enemy.x + enemy.width / 2), 2) +
          Math.pow(this.y + this.height / 2 - (enemy.y + enemy.height / 2), 2)
        );
        console.log(`Entfernung zum Feind: ${distance}`);

        if (distance <= attackRange) {
          console.log('Feind in Reichweite, Schaden zufügen');
          enemy.takeDamage(10); // Schaden zufügen
        }
      }
    });
  }

  shoot() {
    this.attackEnemies(); // Schieße auf Schlangen
    this.world.collisionHandler.checkFireAttackOnSnakes(); // Verwenden Sie die Methode der CollisionHandler-Klasse
    setTimeout(() => {
      this.playAnimation(this.IMAGES_IDLE);  // Setze die Animation zurück auf Idle
    }, 1000);  // Die Dauer der Schuss-Animation, z.B. 1 Sekunde
  }
  

  throwObject() {
    if (this.canThrow()) {
      let bottle = new ThrowableObject(this.x, this.y);
      this.world.throwableObjects.push(bottle);
      this.poisonCollected--; // Decrease the collected poison count
      this.poisonStatusBar.setPercentage(this.poisonCollected * 20); // Update the poison status bar
    }
  }

  canThrow() {
    return this.poisonCollected > 0; // Check if the character has collected poison
  }

  draw(ctx) {
    if (this.isVisible) {
      super.draw(ctx);
    }
  }

  checkThrowableObject() {
    if (this.world.keyboard.D && this.poisonCollected > 0) { // Check if the D key is pressed and poison is collected
        this.throwObject(); // Throw the object
        playPoisonBottleSound(); // Play sound when the bottle is thrown
    }
  }
}