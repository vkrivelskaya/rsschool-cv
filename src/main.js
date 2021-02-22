const selectors = {
    SPEED: '.speed',
    SPEED_BAR: '.speed-bar',
    VIDEO: '.video',
};

const speedElement = document.querySelector(selectors.SPEED);
const speedBarElement = document.querySelector(selectors.SPEED_BAR);
const videoElement = document.querySelector(selectors.VIDEO);

function updateSpeed(coordinateY) {
    if (coordinateY <= speedBarElement.offsetHeight) {
        const speedElementFillPercent = coordinateY / speedBarElement.offsetHeight;
        const minSpeed = 0.4;
        const maxSpeed = 10;
        const speedElementHeight = Math.round(speedElementFillPercent * 100) + '%';
        const playbackRate = speedElementFillPercent * (maxSpeed - minSpeed) + minSpeed;

        speedElement.style.height = speedElementHeight;
        speedElement.textContent = playbackRate.toFixed(1) + '×';
        videoElement.playbackRate = playbackRate;
    }    
}

function determineMouseCoordinates(e) {   
    updateSpeed(e.offsetY);    
}

function determineTouchCoordinates(e) {
    e.preventDefault(); 
    updateSpeed(e.touches[0].clientY);
}

function init() {
    speedBarElement.addEventListener('mousemove', determineMouseCoordinates);
    speedBarElement.addEventListener('touchmove', determineTouchCoordinates);
}

init(); 