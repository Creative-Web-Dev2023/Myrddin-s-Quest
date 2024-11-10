import { World } from './world.class.js'; // Importieren Sie World

function gameLoop() {
    // ...existing code...
    if (world.objects && Array.isArray(world.objects)) {
        world.objects.forEach(object => {
            // ...existing code...
        });
    } else {
        console.error('World objects is not an array or is undefined');
    }
    // ...existing code...
}

function init() {
    // ...existing code...
    if (!world.objects) {
        world.objects = [];
    }
    gameLoop();
}

// ...existing code...
