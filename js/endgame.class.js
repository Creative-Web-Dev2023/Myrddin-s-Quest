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
    document.getElementById("game-over-container").style.display = "flex";
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
    if (!this.world.character) {
      return;
    }

    this.world.character.reset();
    this.world.resetEnemies();
    this.world.resetObjects();
    this.hideGameOverScreen();
    this.world.character.applyGravity();
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
    muteAllSounds();
  }
  /**
   * Displays the "You Win" screen.
   */
  showYouWinScreen() {
    document.getElementById("win-screen").style.display = "block";
    this.clearAllIntervals();
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
