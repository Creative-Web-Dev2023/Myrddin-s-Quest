class CollectableObjects extends DrawableObject {
    isActive = true; // Gibt an, ob das Objekt aktiv ist
    currentImageIndex = 0; // Aktueller Frame der Animation
  
    static TYPES = {
        COIN: {
            images: [
                "img/game_items/coin1.png",
                "img/game_items/coin2.png",
                "img/game_items/coin3.png",
                "img/game_items/coin4.png",
                "img/game_items/coin5.png",
                "img/game_items/coin6.png",
                "img/game_items/coin7.png",
                "img/game_items/coin8.png",
                "img/game_items/coin9.png",
                "img/game_items/coin10.png",
            ],
            width: 30,
            height: 30,
        },
        KEY: {
            images: [
                "img/game_items/key.png",
            ],
            width: 60,
            height: 60,
        },
        POISON: {
            images: [
                "img/poison/1.png",
                "img/poison/2.png",
                "img/poison/3.png",
                "img/poison/4.png",
                "img/poison/5.png",
                "img/poison/6.png",
                "img/poison/7.png",
                "img/poison/8.png",
            ],
            width: 30,
            height: 50,
        },
    };
  
    constructor(x, y, type) {
        super(); // Ruft den Konstruktor der Basisklasse (DrawableObject) auf
  
        if (!CollectableObjects.TYPES[type]) {
            throw new Error(`Unbekannter Collectable-Typ: ${type}`);
        }
  
        const { images, width, height } = CollectableObjects.TYPES[type]; // Wähle die Eigenschaften basierend auf dem Typ
        this.imageCache = {};
        this.loadImages(images); // Bilder des Typs laden
        this.images = images; // Speichere die Bilder des Typs
        this.x = x; // Position des Sammelobjekts
        this.y = y;
        this.width = width; // Breite des Objekts
        this.height = height; // Höhe des Objekts
        this.img = this.imageCache[this.images[this.currentImageIndex]]; // Setze das erste Bild
        this.animate(); // Startet die Animation
    }
  
    loadImages(images) {
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
            this.imageCache[src] = img; // Speichert die Bilder im Cache
        });
    }
  
    animate() {
        this.animationInterval = setInterval(() => {
            if (!this.isActive) {
                clearInterval(this.animationInterval); // Beendet die Animation, wenn das Objekt inaktiv ist
                return;
            }
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            this.img = this.imageCache[this.images[this.currentImageIndex]];
        }, 100); // Geschwindigkeit der Animation
    }
  
    draw(ctx) {
        if (this.isActive) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
  
    deactivate() {
        this.isActive = false; // Setzt das Objekt inaktiv, z. B. nach dem Sammeln
    }
  
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }
  }
  
  class Coin extends CollectableObjects {
      constructor(x, y) {
          super(x, y, 'COIN'); // Rufe den Konstruktor der Basisklasse auf und setze den Typ auf 'COIN'
      }
  }
  class PoisonObject extends CollectableObjects {
    constructor(x, y) {
        super(x, y, 'POISON'); // Rufe den Konstruktor der Basisklasse auf und setze den Typ auf 'POISON'
    }
  
    // Hier kannst du spezifische Methoden für das Giftobjekt hinzufügen
  }
 
  
  class Key extends CollectableObjects {
      constructor(x, y) {
          super(x, y, 'KEY'); // Rufe den Konstruktor der Basisklasse auf und setze den Typ auf 'KEY'
      }
  
      // Hier kannst du spezifische Methoden für den Schlüssel hinzufügen
  }