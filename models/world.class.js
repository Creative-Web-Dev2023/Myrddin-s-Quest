/**
 * Represents the game world, manages all game objects, updates, and rendering.
 */
class World {
  canvas;
  keyboard;
  ctx;
  level;
  character;
  camera_x = 0;
  backgrounds = [];
  candles = [];
  skulls = [];
  knights = [];
  poisons = [];
  hearts = [];
  traps = [];
  key;
  door;
  endboss;
  throwableObjects = [];
  characterStatusBar;
  poisonStatusBar;
  endbossHealthBar;
  characterKeyIcon;
  characterTickIcon;
  running;
  victoryTriggered;
  collisionHandler;
  IMAGES_YOU_LOST = LOADED_IMAGES.gameUI.game_over;
  quitButtonImage = LOADED_IMAGES.gameUI.quit_game;
  tryAgainButtonImage = LOADED_IMAGES.gameUI.try_again;

  /**
   * Creates a new World instance.
   * @param {HTMLCanvasElement} canvas
   * @param {Keyboard} keyboard
   * @param {Level} level1
   */
  constructor(canvas, keyboard, level1) {
    this.canvas = canvas;
    this.level = level1;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.running = true;
    this.victoryTriggered = false;
    this.initializeGameObjects();
  }

  /**
   * Initializes all game objects in the world.
   */
  initializeGameObjects() {
    this.initializeCharacter();
    this.backgrounds = this.level.backgrounds;
    this.candles = this.level.candles;
    this.skulls = this.level.skulls;
    this.knights = this.level.knights;
    this.poisons = this.level.poisons;
    this.hearts = this.level.hearts;
    this.key = this.level.key;
    this.door = this.level.door;
    this.traps = this.level.traps;
    this.initializeEndboss();
    this.collisionHandler = new CollisionHandler(this);
    this.camera_x = -this.character.x + 100;
  }

  /**
   * Initializes the main character and its status bars/icons.
   */
  initializeCharacter() {
    this.character = new Character(this);
    this.characterStatusBar = new StatusBar(
      "health",
      20,
      20,
      200,
      40,
      "Wizard"
    );
    this.poisonStatusBar = new StatusBar("poison", 20, 70, 200, 40);
    this.character.setStatusBars(this.characterStatusBar, this.poisonStatusBar);
    this.character.healthBar.setPercentage(this.character.energy);
    this.character.poisonBar.setPercentage(this.character.poisonCollected);
    this.characterKeyIcon = new Key(250, 10);
    this.character.setKeyIcon(this.characterKeyIcon);
    this.characterTickIcon = new TickIcon();
    this.character.setTickIcon(this.characterTickIcon);
  }

  /**
   * Initializes the endboss and its status bar.
   */
  initializeEndboss() {
    this.endboss = this.level.endboss;
    this.endbossHealthBar = new StatusBar("endboss", 720, 20, 200, 40, "Troll");
    this.endboss.setStatusBars(this.endbossHealthBar);
    this.endboss.healthBar.setPercentage(this.endboss.energy);
  }

  /**
   * Updates all game objects and handles collisions.
   */
  update() {
    this.character.update();
    this.camera_x = -this.character.x + 100;
    this.updatePoisons();
    this.updateHearts();
    this.updateKnights();
    this.updateKey();
    this.endboss.update();
    this.updateCollisions();
    this.collisionHandler.checkThrowObjects();
    this.updateThrowableObjects();
  }

  /**
   * Updates all poison objects.
   */
  updatePoisons() {
    if (Array.isArray(this.poisons) && this.poisons.length > 0)
      this.poisons.forEach((poison) => poison.update());
  }

  /**
   * Updates all heart objects.
   */
  updateHearts() {
    if (Array.isArray(this.hearts) && this.hearts.length > 0)
      this.hearts.forEach((heart) => heart.handleFloating());
  }

  /**
   * Updates all knight objects.
   */
  updateKnights() {
    if (Array.isArray(this.knights) && this.knights.length > 0)
      this.knights.forEach((knight) => knight.update());
  }

  /**
   * Updates the key object (floating animation).
   */
  updateKey() {
    if (this.key) this.key.handleFloating();
  }

  /**
   * Removes throwable objects marked for removal.
   */
  updateThrowableObjects() {
    this.throwableObjects = this.throwableObjects.filter(
      (obj) => !obj.markedForRemoval
    );
  }

  /**
   * Checks all relevant collisions in the world.
   */
  updateCollisions() {
    this.collisionHandler.checkCollisionWithKey();
    this.collisionHandler.checkCollisionWithCollectableItem(
      "hearts",
      LOADED_SOUNDS.heart.collected,
      "energy",
      20
    );
    this.collisionHandler.checkCollisionWithCollectableItem(
      "poisons",
      LOADED_SOUNDS.poison.collected,
      "poisonCollected",
      12.5
    );
    this.collisionHandler.checkCollisionWithKnight();
    this.collisionHandler.checkCollisionWithTrap();
    this.collisionHandler.checkBottleCollisionWithEndboss();
    this.collisionHandler.checkEndbossCollisionWithCharacter();
    this.collisionHandler.checkCollisionCharacterDoor();
    this.collisionHandler.checkCollisionWithTriggerZone();
  }

  /**
   * Triggers the victory state and shows the winner screen.
   */
  triggerVictory() {
    const winSound = LOADED_SOUNDS.game.you_win;
    winSound.volume = 0.5;
    this.character.playSound(winSound);
    this.running = false;
    showEndScreen("winnerScreen");
  }

  /**
   * Triggers the failure state and shows the loser screen.
   */
  triggerFailure() {
    const loseSound = LOADED_SOUNDS.game.you_lose;
    loseSound.volume = 0.5;
    this.character.playSound(loseSound);
    this.running = false;
    showEndScreen("loserScreen");
  }

  /**
   * Draws all game objects and UI elements to the canvas.
   */
  draw() {
    this.clearCanvas();
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);
    this.drawBackgroundObjects();
    this.drawGameObjects();
    this.drawSpecialObjects();
    this.ctx.restore();
    this.drawStatusAndIcons();
  }

  /**
   * Draws background objects (backgrounds, candles, skulls).
   */
  drawBackgroundObjects() {
    this.addObjectsToMap(this.backgrounds);
    this.addObjectsToMap(this.candles);
    this.addObjectsToMap(this.skulls);
  }

  /**
   * Draws main game objects (knights, poisons, hearts, traps, key, door, endboss, character, throwable objects).
   */
  drawGameObjects() {
    if (Array.isArray(this.knights) && this.knights.length > 0) {
      this.addObjectsToMap(this.knights);
    }
    if (Array.isArray(this.poisons) && this.poisons.length > 0) {
      this.addObjectsToMap(this.poisons);
    }
    if (Array.isArray(this.hearts) && this.hearts.length > 0) {
      this.addObjectsToMap(this.hearts);
    }
    this.addObjectsToMap(this.traps);
    if (this.key) this.addToMap(this.key);
    this.addToMap(this.door);
    if (this.endboss) this.addToMap(this.endboss);
    if (this.character) this.addToMap(this.character);
    if (
      Array.isArray(this.throwableObjects) &&
      this.throwableObjects.length > 0
    ) {
      this.addObjectsToMap(this.throwableObjects);
    }
  }

  /**
   * Draws special objects like door messages or debug hitboxes.
   */
  drawSpecialObjects() {
    if (this.door && this.door.isMessageActive) {
      this.door.drawMessage(this.ctx);
    }
    // Add debug or special drawing here if needed (e.g. hitboxes)
  }

  /**
   * Draws status bars and icons (UI layer).
   */
  drawStatusAndIcons() {
    this.addToMap(this.character.healthBar);
    this.addToMap(this.character.poisonBar);
    this.addToMap(this.character.keyIcon);
    this.addToMap(this.endbossHealthBar);
    this.character.healthBar.drawLabel(this.ctx);
    this.endbossHealthBar.drawLabel(this.ctx);
    if (this.character.keyCollected) {
      this.character.tickIcon.draw(this.ctx);
    }
  }

  /**
   * Clears the entire canvas.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Adds an array of objects to the map (draws them).
   */
  addObjectsToMap(objects) {
    if (!Array.isArray(objects)) {
      console.warn("[addObjectsToMap()] kein Array übergeben:", objects);
      return;
    }
    objects.forEach((object, i) => {
      if (!object) {
        console.warn(`[addObjectsToMap()] Objekt an Index ${i} ist undefined`);
      }
      this.addToMap(object);
    });
    if (
      this.backgrounds.length > 0 &&
      this.camera_x >= this.backgrounds[0].width
    ) {
      this.camera_x = 0;
    }
  }

  /**
   * Adds a single object to the map (draws it).
   */
  addToMap(mo) {
    if (!mo) {
      console.warn("[addToMap()] mo ist undefined oder null!");
      console.trace();
      return;
    }
    if (mo.otherDirection) this.flipImage(mo);
    if (mo.isActive !== false) {
      try {
        mo.draw(this.ctx);
      } catch (err) {
        console.error(
          `[addToMap()] Fehler beim Zeichnen von ${mo.constructor?.name}:`,
          err
        );
      }
    }
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Flips the image horizontally for mirrored drawing.
   * @param {DrawableObject} mo
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the image orientation after flipping.
   * @param {DrawableObject} mo
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}