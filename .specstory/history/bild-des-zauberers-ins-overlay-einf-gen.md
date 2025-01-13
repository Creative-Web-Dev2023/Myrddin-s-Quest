## SpecStory

## Bild des Zauberers ins Overlay einfügen (10/13/2024, 1:53:53 PM)

_**User**_

ich möchte ein kleines bild von mein wizzard einfügen

---

_**Assistant**_

Um ein kleines Bild von deinem Zauberer in das Overlay einzufügen, kannst du das `<img>`-Tag innerhalb des `<div class="overlay">` hinzufügen. Hier ist die aktualisierte Code-Sektion:

```html:index.html
        <div class="overlay">
            <h1 class="overlay-title">Myrddin's Quest</h1> <!-- Titel im Overlay -->
            <p class="overlay-text">Embark on an Epic Adventure</p> <!-- Text im Overlay -->
            <img src="path/to/your/wizard-image.png" alt="Wizard" class="wizard-image"> <!-- Bild des Zauberers -->
            <button onclick="startGame()">Start Game</button>
        </div>
```

### Änderungen:
- Ein `<img>`-Tag wurde hinzugefügt, um das Bild des Zauberers anzuzeigen. Stelle sicher, dass du den `src`-Pfad zu deinem Bild anpasst.

---



---

