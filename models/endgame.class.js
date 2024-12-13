class EndGame {
    constructor(world) {
      this.world = world;
    }
  
    showYouLostScreen() {
      const gameOverContainer = document.getElementById('game-over-container');
      gameOverContainer.style.display = 'flex';
      document.getElementById('quitButton').style.display = 'block';
      document.getElementById('tryAgain').style.display = 'block';
    }
  
    // Zeigt den "Level Completed" Bildschirm an
    showLevelCompletedText() {
      const levelCompletedContainer = document.getElementById('level-completed-container');
      levelCompletedContainer.classList.remove('hidden');
      levelCompletedContainer.classList.add('show');
      this.stopGame(); // Stoppt das Spiel
    }
  
    // Stoppt das Spiel
    stopGame() {
      clearInterval(this.world.gameLoopInterval); // Stoppt die Spielschleife
    }
  }
  