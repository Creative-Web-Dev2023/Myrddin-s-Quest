let gameRestarted = false;
let isDead = false;

/**
 * Class to manage the end state of the game.
 */
class EndGame {
  constructor(world) {
    this.world = world;
  }

  /**
   * Zeigt den Game-Over-Bildschirm an.
   */
  showGameOverScreen() {
    const gameOverContainer = document.getElementById("game-over-container");
    if (gameOverContainer) gameOverContainer.style.display = "flex";
    stopAllSounds();
  }
  /**
   * Versteckt den Game-Over-Bildschirm.
   */
  hideGameOverScreen() {
    document.getElementById("game-over-container").style.display = "none";
  }

  /**
   * Startet das Spiel neu und setzt den Charakter, die Feinde und Objekte zurück.
   */
  restartGame() {
    isDead = false; 
    gameRestarted = true; 
    if (!this.world.character) {
      return;
    }
    this.world.resetEnemies();
    this.world.resetObjects();
    this.world.character.reset();
    this.world.resetCamera();
    this.hideGameOverScreen();
    this.world.character.applyGravity();
    cancelAnimationFrame(this.world.loopID);
    gameLoop();
  }

  /**
   * Setzt das Spiel fort, indem der gespeicherte Zustand wiederhergestellt wird.
   */
  resumeGame() {
    const lastPosition = this.world.character.lastPosition || {
      x: 130,
      y: 150,
    };
    this.world.character.resetPosition(lastPosition);
    this.world.camera_x = -this.world.character.x - 190;
    this.hideGameOverScreen();
    this.world.character.applyGravity();
    gameLoop();
  }

  /**
   * Zeigt den "You Lost"-Bildschirm an.
   */
  showYouLostScreen() {
    document.getElementById("game-over-container").style.display = "flex";
    stopAllSounds();
  }

  /**
   * Zeigt den "You Win"-Bildschirm an.
   */
  showYouWinScreen() {
    const winScreen = document.getElementById("win-screen");
    this.hideGameOverScreen();
    if (!winScreen) {
      console.error("Win screen element not found.");
      return;
    }
    winScreen.style.display = "block";
    winScreen.classList.remove("hidden");
    winScreen.classList.add("show");

    const restartButton = document.getElementById("winTryAgainButton");
    restartButton.onclick = () => {
      this.hideWinScreen();
      this.restartGame();
    };

    this.clearAllIntervals();
    stopAllSounds();
    cancelAnimationFrame(this.world.loopID);
  }

  /**
   * Versteckt den "You Win"-Bildschirm.
   */
  hideWinScreen() {
    const winScreen = document.getElementById("win-screen");
    if (winScreen) {
      winScreen.style.display = "none";
      winScreen.classList.add("hidden");
      winScreen.classList.remove("show");
    }
  }

  /**
   * Clears all set intervals.
   */
  clearAllIntervals() {
    if (this.intervalIDs && this.intervalIDs.length > 0) {
      this.intervalIDs.forEach(clearInterval);
      this.intervalIDs = [];
    }
  }

  /**
   * Schedules the "You Lost" screen to be shown after a delay.
   */
  scheduleShowYouLostScreen() {
    setTimeout(() => {
      this.showYouLostScreen();
    }, 500);
  }
}
