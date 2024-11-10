import { Snake } from './snake.class.js';

// ...existing code...

const level1 = {
    enemies: [
        new Snake(800, 200),
        // ...weitere Feinde...
    ],
    backgroundObjects: [
        // ...Hintergrundobjekte...
    ],
    clouds: [
        // ...Wolkenobjekte...
    ]
};

// Exportieren Sie level1, damit es in anderen Dateien verwendet werden kann
export { level1 };

// ...existing code...
