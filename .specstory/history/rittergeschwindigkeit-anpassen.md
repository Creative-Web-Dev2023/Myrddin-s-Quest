## SpecStory

## Rittergeschwindigkeit anpassen (10/13/2024, 1:50:28 PM)

_**User**_

die knights gehen viel zu schnell

---

_**Assistant**_

Um die Geschwindigkeit der Ritter zu reduzieren, können wir den Wert der `speed`-Eigenschaft im Konstruktor anpassen. Hier ist der aktualisierte Codeblock:

```javascript:models/knight.class.js
    constructor() {
        super().loadImage('img/knight/walk/walk_0.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.05 + Math.random() * 0.2; // Geschwindigkeit reduziert
        this.animate();
    }
```

**Änderungserklärung:** Die Werte für `this.speed` wurden verringert, um die Geschwindigkeit der Ritter zu reduzieren.

---



---

