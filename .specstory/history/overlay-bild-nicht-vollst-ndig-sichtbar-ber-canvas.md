## SpecStory

## Overlay-Bild nicht vollständig sichtbar über Canvas (10/13/2024, 2:09:02 PM)

_**User**_

das overlay bild ist nicht ganz zu sehen und über den canvas hilf mir dabei

---

_**Assistant**_

Um sicherzustellen, dass das Overlay-Bild vollständig sichtbar ist und nicht über den Canvas hinausgeht, kannst du die `width` und `height` des Overlays anpassen. Hier ist der aktualisierte Code:

```css:style.css
.overlay {
  /* ... bestehender Code ... */
  width: 100%; /* Overlay nimmt die volle Breite ein */
  height: 100%; /* Overlay nimmt die volle Höhe ein */
  /* ... bestehender Code ... */
}
```

### Änderungen:
- Die `width` und `height` des `.overlay` wurden auf `100%` gesetzt, damit das Overlay die gesamte Fläche des Canvas einnimmt. 

Stelle sicher, dass das Canvas auch die richtige Größe hat, um das Overlay korrekt darzustellen.

---



---

