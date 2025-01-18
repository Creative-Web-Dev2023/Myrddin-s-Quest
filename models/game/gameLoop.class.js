class GameLoop {
    constructor(world) {
        this.world = world;
        this.world.canvas.addEventListener("click", this.handleMouseClick.bind(this)); // Add event listener
    }

    start() {
        const gameLoop = () => {
            this.world.update();
            this.world.draw();
            this.world.enemies.forEach((enemy) => {
                if (typeof enemy.update === 'function') {
                    enemy.update(this.world.character);
                }
            });
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }

    handleMouseClick(event) {
        const rect = this.world.canvas.getBoundingClientRect(); // Get the canvas bounding rectangle
        const x = event.clientX - rect.left; // Get the x position of the click
        const y = event.clientY - rect.top; // Get the y position of the click
        const ui = this.world.ui; // Zugriff auf die UI-Instanz
        if (
            x >= ui.quitButton.x && // Check if the click is within the quit button
            x <= ui.quitButton.x + ui.quitButton.width && // Check if the click is within the quit button
            y >= ui.quitButton.y && // Check if the click is within the quit button
            y <= ui.quitButton.y + ui.quitButton.height // Check if the click is within the quit button
        ) {
            
        }
    }
}
