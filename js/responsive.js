
function resizeCanvas() {
  const canvas = document.getElementById("canvas");
  const container = document.getElementById("canvas-container");
  const aspectRatio = 3 / 2; 
  
  let newWidth = window.innerWidth * 0.98;
  let newHeight = newWidth / aspectRatio;
  
  if (newHeight > window.innerHeight * 0.98) {
    newHeight = window.innerHeight * 0.98;
    newWidth = newHeight * aspectRatio;
  }

  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
  container.style.width = `${newWidth}px`;
  container.style.height = `${newHeight}px`;
}


function checkTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}


function setupTouchControls() {
  const controls = document.getElementById("controls");
  if (checkTouchDevice()) {
    controls.style.display = "flex";
  } else {
    controls.style.display = "none";
  }
}


function initResponsive() {
  resizeCanvas();
  setupTouchControls();
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("resize", setupTouchControls);
document.addEventListener("DOMContentLoaded", initResponsive);
