/**
 * Class representing the end game state.
 */
class EndGame {
  IMAGES_YOU_LOST = ["img/game_ui/login&pass/game_over.png"];

  /**
   * Creates an instance of EndGame.
   * @param {Object} world - The world object.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Displays the "You Lost" screen.
   */
  showYouLostScreen() {
    setTimeout(() => {
      const gameOverContainer = document.getElementById("game-over-container");
      gameOverContainer.style.display = "flex";
      document.getElementById("tryAgain").style.display = "block";
      document.getElementById("quitButton").style.display = "block";
      if (this.world && this.world.gameLoop) {
        this.world.gameLoop.running = false;
      }
    }, 2500);
  }
}
