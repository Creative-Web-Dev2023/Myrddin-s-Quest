let gameRestarted = false;
let isDead = false;

/**
 * Class to manage the end state of the game.
 */
class EndGame {
  /**
   * Creates a new instance of EndGame.
   * @param {Object} world - The world in which the game takes place.
   */
  constructor(world) {
    this.world = world;
    this.intervalIDs = [];
    this.lastState = { x: 0, y: 0, energy: 100 };
  }

  /**
   * Ends the game and displays the game over screen.
   */
  gameOver() {
    this.saveGameState();
    document.getElementById("game-over-container").style.display = "flex";
  }

  /**
   * Displays the win screen.
   */
  winScreen() {
    this.clearAllIntervals();
    document.getElementById("win-screen").style.display = "block";
  }

  /**
   * Restarts the game.
   */
  restartGame() {
    this.clearAllIntervals();
    document.getElementById("game-over-container").style.display = "none";
    document.getElementById("win-screen").style.display = "none";
    this.world.initializeGameObjects();
    this.world.resetCamera();
    this.world.character.reset();
    this.world.character.isVisible = true;
    isDead = false;
    gameLoop();
  }

  /**
   * Resumes the game from where the player died.
   */
  resumeGame() {
    const savedState = localStorage.getItem("gameState");
    if (!savedState || savedState === "{}") {
      console.warn("❌ No saved state found!");
      return;
    }
    const parsedState = JSON.parse(savedState);
    this.clearAllIntervals();
    document.getElementById("game-over-container").style.display = "none";
    this.restoreCharacterState(parsedState);
    this.world.character.applyGravity();
    this.restoreEnemiesState(parsedState.enemies);
    this.restoreCrystal();
    gameLoop();
    this.world.draw();
  }

  /**
   * Restores the character's state from the saved data.
   *
   * @param {Object} parsedState - The parsed saved game state.
   */
  restoreCharacterState(parsedState) {
    this.world.character.x = parsedState.x || 130;
    this.world.character.y = parsedState.y || 150;
    this.world.character.energy =
      parsedState.energy > 0 ? parsedState.energy : 100;
    this.world.camera_x = -this.world.character.x + 190;
    this.world.character.isVisible = true;
    isDead = false;
    this.world.character.playAnimation(this.world.character.IMAGES.IDLE);
    this.world.character.animate();
    this.world.character.applyGravity();
  }

  /**
   * Restores the enemies' states from the saved data.
   *
   * @param {Array} enemies - The array of saved enemies.
   */
  restoreEnemiesState(enemies) {
    this.world.enemies = enemies.map((data) => {
      let enemy;
      if (data.type === "Endboss") {
        enemy = new Endboss();
      } else if (data.type === "Knight") {
        enemy = new Knight();
      } else if (data.type === "Snake") {
        enemy = new Snake();
      } else {
        enemy = new Enemy();
      }
      enemy.x = data.x;
      enemy.y = data.y;
      enemy.energy = data.energy ? data.energy : 30;
      enemy.dead = data.dead ? data.dead : false;
      enemy.setWorld(this.world);
      if (enemy.statusBarEndboss) {
        enemy.statusBarEndboss.setPercentage(enemy.energy);
      }
      return enemy;
    });
  }

  /**
   * Restores the crystal in the game world.
   */
  restoreCrystal() {
    this.world.crystal = new Crystal(6471 + 260, 150 + 150);
  }

  /**
   * Saves the current game state.
   */
  saveGameState() {
    const savedEnemies = this.world.enemies.map((enemy) => ({
      type: enemy.constructor.name,
      x: enemy.x,
      y: enemy.y,
      energy: enemy.energy,
      dead: enemy.dead,
    }));
    this.lastState = {
      x: this.world.character.x,
      y: this.world.character.y,
      energy: this.world.character.energy,
      enemies: savedEnemies,
    };
    localStorage.setItem("gameState", JSON.stringify(this.lastState));
  }

  /**
   * Clears all set intervals.
   */
  clearAllIntervals() {
    this.intervalIDs.forEach(clearInterval);
    this.intervalIDs = [];
  }

  /**
   * Displays the "You Lost" screen.
   */
  showYouLostScreen() {
    this.gameOver();
    muteAllSounds();
  }

  /**
   * Checks if the character is dead and handles the game over state.
   */
  checkDeathCondition() {
    if (this.world.character.energy <= 0 && !isDead) {
      this.incrementDeaths();
      isDead = true;
      this.gameOver();
    }
  }

  /**
   * Increments the death count in localStorage.
   */
  incrementDeaths() {
    let deaths = localStorage.getItem("deaths")
      ? JSON.parse(localStorage.getItem("deaths"))
      : 0;
    deaths++;
    localStorage.setItem("deaths", JSON.stringify(deaths));
  }

  /**
   * Displays the "You Win" screen.
   */
  showYouWinScreen() {
    this.clearAllIntervals();
    document.getElementById("win-screen").style.display = "block";
  }
}

/**
 * Mutes all sounds in the game.
 */
function muteAllSounds() {
  const sounds = document.querySelectorAll("audio");
  sounds.forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
}
