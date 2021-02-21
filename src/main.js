const selectors = {
    SPEED: '.speed',
    SPEED_BAR: '.speed-bar',
    VIDEO: '.video',
};

const speedElement = document.querySelector(selectors.SPEED);
const speedBarElement = document.querySelector(selectors.SPEED_BAR);
const videoElement = document.querySelector(selectors.VIDEO);
let coordinateY = 0;

function updateSpeed() {
    if (coordinateY <= speedElement.offsetHeight) {
        const speedBarFillPercent = coordinateY / speedElement.offsetHeight;
        const minSpeed = 0.4;
        const maxSpeed = 10;
        const speedBarElementHeight = Math.round(speedBarFillPercent * 100) + '%';
        const playbackRate = speedBarFillPercent * (maxSpeed - minSpeed) + minSpeed;

        speedBarElement.style.height = speedBarElementHeight;
        speedBarElement.textContent = playbackRate.toFixed(1) + '×';
        videoElement.playbackRate = playbackRate;
    }    
}

function determineMouseCoordinates(e) {    
    coordinateY = e.offsetY;
    updateSpeed();    
}

function determineTouchCoordinates(e) {
    const touchItem = e.touches[0];
    e.preventDefault();    
    coordinateY = touchItem.clientY; 
    updateSpeed();
}

function init() {
    speedElement.addEventListener('mousemove', determineMouseCoordinates);
    speedElement.addEventListener('touchmove', determineTouchCoordinates);
}

init(); 