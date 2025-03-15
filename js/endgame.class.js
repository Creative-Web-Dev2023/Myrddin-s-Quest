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
    const savedState = localStorage.getItem("gameState");
    if (!savedState || savedState === "{}") {
      console.warn("❌ Kein gespeicherter Zustand gefunden!");
      return;
    }
    const parsedState = JSON.parse(savedState);
    this.clearAllIntervals();
    document.getElementById("game-over-container").style.display = "none";
    this.world.character.x = parsedState.x || 130;
    this.world.character.y = parsedState.y || 150;
    this.world.character.energy =
      parsedState.energy > 0 ? parsedState.energy : 100;
    this.world.camera_x = -this.world.character.x + 190;
    this.world.character.isVisible = true;
    isDead = false;
    this.world.enemies = parsedState.enemies.map((data) => {
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
      enemy.energy = data.energy || 30;
      enemy.dead = data.dead || false;
      enemy.setWorld(this.world);
      return enemy;
    });
    this.world.character.playAnimation(this.world.character.IMAGES.IDLE);
    this.world.character.animate();
    this.world.character.applyGravity();
    this.world.crystal = new Crystal(6471 + 260, 150 + 150); // Stelle sicher, dass der Kristall wieder erscheint
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
    let savedEnemies = this.world.enemies.map((enemy) => ({
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
      deaths: deaths,
      enemies: savedEnemies,
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
    muteAllSounds(); 
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

function muteAllSounds() {
  const sounds = document.querySelectorAll("audio");
  sounds.forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
}
