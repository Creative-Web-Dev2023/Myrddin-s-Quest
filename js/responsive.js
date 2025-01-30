
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


window.addEventListener('resize', () => {
    adjustCanvasSize();
    checkOrientation();
});

function setupResponsiveEvents() {
    const isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        setupTouchControls();
    } else {
        document.body.classList.add('desktop-device');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupResponsiveEvents();
    checkOrientation();
}); 