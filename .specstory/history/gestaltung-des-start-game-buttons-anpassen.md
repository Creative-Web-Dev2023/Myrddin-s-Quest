## SpecStory

## Gestaltung des Start Game Buttons anpassen (10/13/2024, 3:02:50 PM)

_**User**_

irgendwie habe ich 4 butttons ich will nur mein startgame button so gestalten

---

_**Assistant**_

Um nur den "Start Game" Button zu gestalten, kannst du eine spezifische Klasse für diesen Button hinzufügen und die bestehenden Stile entsprechend anpassen. Hier ist der aktualisierte Code, der nur den "Start Game" Button betrifft:

```css:style.css
/* Füge eine spezifische Klasse für den Start Game Button hinzu */
.start-game-button {
  position: relative;
  width: 160px;
  height: 50px;
  line-height: 48px;
  background: #000;
  text-transform: uppercase;
  font-size: 25px;
  text-align: center;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: 0.5s;

  -webkit-box-reflect: below 1px linear-gradient(transparent, #0004);
}

.start-game-button span {
  position: absolute;
  display: block;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  text-align: center;
  background: #0c0c0c;
  color: rgba(255, 255, 255, 0.2);
  transition: 0.5s;
}

.start-game-button:hover span {
  color: rgba(255, 255, 255, 1);
}

/* ... bestehende Stile für a::before, a::after und Animationen ... */
```

### Änderungen:
1. **Neue Klasse `.start-game-button`**: Diese Klasse wurde erstellt, um den spezifischen Button zu stylen.
2. **Anpassung der Selektoren**: Alle Stile, die zuvor für `a` definiert waren, wurden auf `.start-game-button` geändert.

Stelle sicher, dass du die Klasse `start-game-button` zu deinem "Start Game" Button im HTML hinzufügst, damit die Stile angewendet werden.

---



---

