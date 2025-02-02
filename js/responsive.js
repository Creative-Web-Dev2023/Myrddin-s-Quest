function adjustCanvasSize() {
    const canvas = document.getElementById('canvas');
    const aspectRatio = 16/9; 
    if (window.innerWidth / aspectRatio < window.innerHeight) {
        canvas.style.width = '95vw';
        canvas.style.height = `${95/aspectRatio}vw`;
    } else {
        canvas.style.height = '95vh';
        canvas.style.width = `${95*aspectRatio}vh`;
    }
}

adjustCanvasSize();

function detectTouchDevice() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    document.body.classList.toggle('touch-device', isTouch);
    document.body.classList.toggle('desktop-device', !isTouch);
    return isTouch;
}

function setupResponsiveEvents() {
    const isTouchDevice = detectTouchDevice();
    
    if (isTouchDevice) {
        setupTouchControls();
        // Mobile-spezifische Initialisierungen
        adjustControlButtons();
    }
    
    // Gemeinsame Events
    window.addEventListener('resize', handleResponsiveResize);
}

function handleResponsiveResize() {
    adjustCanvasSize();
    checkOrientation();
    
    if (document.body.classList.contains('touch-device')) {
        adjustControlButtons();
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    detectTouchDevice();
    setupResponsiveEvents();
    checkOrientation();
    adjustCanvasSize();
}); 