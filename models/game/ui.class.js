class UI {
  constructor(canvas) {
    this.canvas = canvas;
    this.initializeButtons();
  }

  initializeButtons() {
    const buttonWidth = 100;
    const buttonHeight = 40;
    const canvasCenterX = this.canvas.width / 2;
    const buttonSpacing = 20;

    this.quitButton = {
      x: canvasCenterX - buttonWidth - buttonSpacing / 2,
      y: this.canvas.height - buttonHeight - 20,
      width: buttonWidth,
      height: buttonHeight,
    };
    this.tryAgainButton = {
      x: canvasCenterX + buttonSpacing / 2,
      y: this.quitButton.y,
      width: buttonWidth,
      height: buttonHeight,
    };
  }
}
