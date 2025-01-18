class UI {
    constructor(canvas) {
        this.canvas = canvas;
        this.initializeButtons();
    }

    initializeButtons() {
        const buttonWidth = 100; // Width of the buttons
        const buttonHeight = 40; // Height of the buttons
        const canvasCenterX = this.canvas.width / 2; // Center of the canvas
        const buttonSpacing = 20; // Spacing between buttons

        this.quitButton = {
            x: canvasCenterX - buttonWidth - buttonSpacing / 2, // X position of the quit button
            y: this.canvas.height - buttonHeight - 20, // Y position of the quit button
            width: buttonWidth, // Width of the quit button
            height: buttonHeight, // Height of the quit button
        };
        this.tryAgainButton = {
            x: canvasCenterX + buttonSpacing / 2, // X position of the try again button
            y: this.quitButton.y, // Y position of the try again button
            width: buttonWidth, // Width of the try again button
            height: buttonHeight, // Height of the try again button
        };
    }
}
