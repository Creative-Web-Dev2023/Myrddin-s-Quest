class EndGame {
  IMAGES_YOU_LOST = [
    "img/game_ui/login&pass/game_over.png",
  ];

  constructor(world) {
    this.world = world;
  }

  showYouLostScreen() {
    setTimeout(() => {
      const gameOverContainer = document.getElementById('game-over-container');
      gameOverContainer.style.display = 'flex';
      document.getElementById('tryAgain').style.display = 'block';
    }, 2500); // Verzögerung von 3500 ms, um sicherzustellen, dass die Dead-Animation abgeschlossen ist
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
