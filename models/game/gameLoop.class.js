/**
 * Class representing the game loop.
 */ class GameLoop {
   /**
    * Creates an instance of GameLoop.
    * @param {Object} world - The world object.
    */
   constructor(world) {
     this.world = world;
     this.world.canvas.addEventListener(
       "click",
       this.handleMouseClick.bind(this)
     );
   }

   /**
    * Starts the game loop.
    */
   start() {
     if (this.running) {
       console.log("Game Loop läuft bereits mit Loop-ID:", this.loopID);
       return;
     }

     console.log("Game Loop startet...");
     this.running = true;

     const gameLoop = () => {
       if (!this.running) {
         console.log("Game Loop gestoppt!");
         if (this.loopID) {
           cancelAnimationFrame(this.loopID);
         }
         return;
       }

       this.world.update();
       this.world.draw();
       this.world.enemies.forEach((enemy) => {
         if (typeof enemy.update === "function") {
           enemy.update(this.world.character);
         }
       });

       this.loopID = requestAnimationFrame(gameLoop);
     };

     this.loopID = requestAnimationFrame(gameLoop);
     console.log("Neue Loop-ID gesetzt:", this.loopID);
   }

   /**
    * Handles mouse click events on the canvas.
    * @param {MouseEvent} event - The mouse event.
    */
   handleMouseClick(event) {
     const rect = this.world.canvas.getBoundingClientRect();
     const x = event.clientX - rect.left;
     const y = event.clientY - rect.top;
     const ui = this.world.ui;
     if (
       x >= ui.quitButton.x &&
       x <= ui.quitButton.x + ui.quitButton.width &&
       y >= ui.quitButton.y &&
       y <= ui.quitButton.y + ui.quitButton.height
     ) {
     }
   }
 }
