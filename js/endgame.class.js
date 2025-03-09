let gameRestarted = false;
let isDead = false;

/**
 * Klasse zur Verwaltung des Endzustands des Spiels.
 */
class EndGame {
  /**
   * Erstellt eine neue Instanz von EndGame.
   * @param {Object} world - Die Welt, in der das Spiel stattfindet.
   */
  constructor(world) {
    this.world = world;
    this.intervalIDs = [];
    this.lastState = { x: 0, y: 0, energy: 100 };
  }

  /**
   * Beendet das Spiel und zeigt den Game-Over-Bildschirm an.
   */
  gameOver() {
    this.saveGameState();
    document.getElementById("game-over-container").style.display = "flex";
  }

  /**
   * Zeigt den Win-Screen an.
   */
  winScreen() {
    this.clearAllIntervals();
    document.getElementById("win-screen").style.display = "block";
  }

  /**
   * Startet das Spiel neu.
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
    startGameLoop();
  }

  /**
   * Setzt das Spiel an der Stelle fort, an der der Spieler gestorben ist.
   */
  resumeGame() {
    const savedState = JSON.parse(localStorage.getItem("gameState"));
    if (!savedState) {
      console.warn("Kein gespeicherter Zustand, Starten nicht möglich!");
      return;
    }
    this.clearAllIntervals();
    document.getElementById("game-over-container").style.display = "none";
    Object.assign(this.world.character, savedState);
    this.world.camera_x = -savedState.x + 190;
    this.world.character.isVisible = true;
    isDead = false; 
    startGameLoop();
    this.world.draw();
  }

  /**
   * Speichert den aktuellen Spielzustand.
   */
  saveGameState() {
    let deaths = localStorage.getItem("deaths")
      ? JSON.parse(localStorage.getItem("deaths"))
      : 0;
    deaths++;
    localStorage.setItem("deaths", JSON.stringify(deaths));
    this.lastState = {
      x: this.world.character.x,
      y: this.world.character.y,
      energy: 100,
      deaths: deaths,
    };
    localStorage.setItem("gameState", JSON.stringify(this.lastState));
  }

  /**
   * Stoppt alle gesetzten Intervalle.
   */
  clearAllIntervals() {
    this.intervalIDs.forEach(clearInterval);
    this.intervalIDs = [];
  }

  /**
   * Zeigt den "You Lost" Screen an.
   */
  showYouLostScreen() {
    this.gameOver();
  }

  checkDeathCondition() {
    if (this.world.character.energy <= 0 && !isDead) {
      this.incrementDeaths();
      isDead = true;
      this.gameOver();
    }
  }

  incrementDeaths() {
    let deaths = localStorage.getItem("deaths")
      ? JSON.parse(localStorage.getItem("deaths"))
      : 0;
    deaths++;
    localStorage.setItem("deaths", JSON.stringify(deaths));
  }

  showYouWinScreen() {
    this.clearAllIntervals();
    document.getElementById("win-screen").style.display = "block";
  }
}