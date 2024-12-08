class Statusbar extends DrawableObject {
  HEALTH = [
     "img/game_ui/statusbars/statusbar-health/0.png", // 0 Bild
     "img/game_ui/statusbars/statusbar-health/20.png",
     "img/game_ui/statusbars/statusbar-health/40.png",
     "img/game_ui/statusbars/statusbar-health/60.png",
     "img/game_ui/statusbars/statusbar-health/80.png",
     "img/game_ui/statusbars/statusbar-health/100.png", // 6 Bild
   ];
 
   percentage = 100;
 
   constructor() {
     super();
     this.loadImages(this.HEALTH);
     this.x =2; 
     this.y =10; // Position der Statusbar
     this.width = 190;  // Passe die Breite an
     this.height = 50;  // Passe die Höhe an
     this.setPercentage(100); // Setzt die Statusbar zu Beginn auf 100%
   }
 
   setPercentage(percentage) {
     this.percentage = percentage;  // Setzt den Prozentwert
     let path = this.HEALTH[this.resolveImageIndex()];  // Bild-Pfad anhand des Prozentwerts setzen
     this.img = this.imageCache[path];  // Bild setzen
   }
   
   resolveImageIndex() {
     if (this.percentage >= 100) {
       return 5;
     } else if (this.percentage >= 80) {
       return 4;
     } else if (this.percentage >= 60) {
       return 3;
     } else if (this.percentage >= 40) {
       return 2;
     } else if (this.percentage >= 20) {
       return 1;
     } else {
       return 0;
     }
   }
 }