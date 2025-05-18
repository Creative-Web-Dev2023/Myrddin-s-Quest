class World {
  canvas;
  keyboard;
  ctx;
  loopId;
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
  // throwableObjects = [];

  characterStatusBar;
  poisonStatusBar;
  endbossHealthBar;
  characterKeyIcon;
  characterTickIcon;

  endGame;
  quitButton;
  tryAgainButton;
  IMAGES_YOU_LOST = LOADED_IMAGES.gameUI.game_over;
  quitButtonImage = LOADED_IMAGES.gameUI.quit_game;
  tryAgainButtonImage = LOADED_IMAGES.gameUI.try_again;

  constructor(canvas, keyboard, level1) {
    this.canvas = canvas;
    this.level = level1;
    this.ctx = canvas.getContext('2d');
    this.keyboard = keyboard;
    this.loopId = null;
    // this.keyboard.linkButtonsToPressEvents();
    // NICHT löschen! später wieder einkommentieren, wenn die IDs vorhanden sind.

    this.initializeGameObjects();
    this.collisionHandler = new CollisionHandler(this);
  }

  initializeGameObjects() {
    this.character = new Character(this);
    this.characterStatusBar = new StatusBar(
      'health',
      20,
      20,
      200,
      40,
      'Wizard'
    );
    this.poisonStatusBar = new StatusBar('poison', 20, 70, 200, 40);
    this.character.setStatusBars(this.characterStatusBar, this.poisonStatusBar);
    this.characterKeyIcon = new Key(250, 10);
    this.character.setKeyIcon(this.characterKeyIcon);
    this.characterTickIcon = new TickIcon();
    this.character.setTickIcon(this.characterTickIcon);

    this.backgrounds = this.level.backgrounds || [];
    this.candles = this.level.candles || [];
    this.skulls = this.level.skulls || [];
    this.knights = this.level.knights || [];
    this.poisons = this.level.poisons || [];
    this.hearts = this.level.hearts || [];
    this.key = this.level.key;
    this.door = this.level.door;
    this.traps = this.level.traps || [];
    this.endboss = this.level.endboss;
    this.endbossHealthBar = new StatusBar('endboss', 720, 20, 200, 40, 'Troll');
    this.endboss.setStatusBars(this.endbossHealthBar);

    this.camera_x = -this.character.x + 100;
  }

  update() {
    this.character.handleMovements();
    this.camera_x = -this.character.x + 100;
    this.character.handleAnimations();
    if (Array.isArray(this.poisons) && this.poisons.length > 0) {
      this.poisons.forEach((poison) => {
        poison.handleAnimations();
        poison.handleFloating();
      });
    }
    if (Array.isArray(this.hearts) && this.hearts.length > 0) {
      this.hearts.forEach((heart) => heart.handleFloating());
    }
    if (Array.isArray(this.hearts) && this.hearts.length > 0) {
      this.knights.forEach((knight) => {
        knight.handleAnimations();
        knight.moveLeft();
      });
    }
    if (this.key) this.key.handleFloating();
    this.traps.forEach((trap) => trap.handleAnimations());
    this.endboss.handleAnimations();
    this.endboss.patrol();

    this.updateCollisions();
  }

  updateCollisions() {
    this.checkCollisionWithKey();
    this.poisons = this.checkCollisionWithCollectableItem(
      this.poisons,
      LOADED_SOUNDS.poison.collected,
      () => {
        this.character.poisonCollected += 1;
      }
    );

    this.hearts = this.checkCollisionWithCollectableItem(
      this.hearts,
      LOADED_SOUNDS.heart.collected,
      () => {
        this.character.energy = Math.min(this.character.energy + 20, 100);
      }
    );
  }

  checkCollisionWithKey() {
    if (!this.key) return;

    if (this.character.isColliding(this.key)) {
      this.character.keyCollected = true;
      if (sounds) {
        this.key.pingSound.pause();
        this.key.pingSound.currentTime = 0;
        this.key.pingSound.play();
      }

      this.key = null;
    }
  }

  checkCollisionWithCollectableItem(array, sound, effectFn) {
    if (!array || array.length === 0) return;

    return array.filter((item) => {
      if (this.character.isColliding(item)) {
        effectFn();

        if (sounds) {
          sound.pause();
          sound.currentTime = 0;
          sound.play();
        }
        return false;
      }

      return true;
    });
  }

  draw() {
    this.clearCanvas();
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgrounds);
    this.addObjectsToMap(this.candles);
    this.addObjectsToMap(this.skulls);
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

    this.character.drawFrame(this.ctx);
    if (this.key) this.key.drawFrame(this.ctx);
    if (Array.isArray(this.knights) && this.knights.length > 0) {
      this.knights.forEach((knight) => knight.drawFrame(this.ctx));
    }
    if (Array.isArray(this.poisons) && this.poisons.length > 0) {
      this.poisons.forEach((poison) => poison.drawFrame(this.ctx));
    }
    if (Array.isArray(this.hearts) && this.hearts.length > 0) {
      this.hearts.forEach((heart) => heart.drawFrame(this.ctx));
    }
    this.traps.forEach((trap) => trap.drawFrame(this.ctx));
    if (this.endboss) this.endboss.drawInnerFrame(this.ctx);
    if (this.endboss) this.endboss.drawOuterFrame(this.ctx);

    this.ctx.restore();

    this.addToMap(this.character.healthBar);
    this.addToMap(this.character.poisonBar);
    this.addToMap(this.character.keyIcon);
    this.addToMap(this.endbossHealthBar);
    this.character.healthBar.drawLabel(this.ctx);
    this.endbossHealthBar.drawLabel(this.ctx);
    if (this.character.keyCollected) {
      this.character.tickIcon.draw(ctx);
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addObjectsToMap(objects) {
    if (!Array.isArray(objects)) {
      console.warn('[addObjectsToMap()] kein Array übergeben:', objects);
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

  addToMap(mo) {
    if (!mo) {
      console.warn('[addToMap()] mo ist undefined oder null!');
      console.trace(); // <-- zeigt dir, woher der Aufruf kam!
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

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}