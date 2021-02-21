const selectors = {
    VIDEO: '.video',
    PLAY: '.play-button',
    CONTROLS: '.player-controls',
    PLAYER:'.player',
    PROGRESS: '.progress',
    PROGRESS_FILLED: '.progress-filled',
    TIMER: '.timer',
};

const classes = {
    PLAY_BTN: 'play-button',
    FULL_SCREEN_BUTTON: 'fullscreen-button',    
    SKIP_BTN: 'skip-button',
    PROGRESS: 'progress',    
};

const videoElement = document.querySelector(selectors.VIDEO);
const playButton = document.querySelector(selectors.PLAY);
const progressElement = document.querySelector(selectors.PROGRESS);

function setTime() {
    const timerElement = document.querySelector(selectors.TIMER);    
    const minutes = Math.floor(videoElement.currentTime / 60);
    const seconds = Math.floor(videoElement.currentTime - minutes * 60);  
    const minuteValue = minutes < 10 ? '0' + minutes : minutes;
    const secondValue = seconds < 10 ? '0' + seconds : seconds;

    timerElement.textContent = `${minuteValue} : ${secondValue}`;
}

function togglePlayPauseVideoState() {
    if (videoElement.paused) {
        videoElement.play();
    } else {
        videoElement.pause();
    }    
}

function togglePlayButton() {        
    playButton.textContent = videoElement.paused ? '▶' : '❚ ❚';
}

function toggleFullscreen() {
    const playerElement = document.querySelector(selectors.PLAYER);

    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {        
        playerElement.requestFullscreen();        
    }
}

function skipVideo(skipTime) {    
    videoElement.currentTime += parseFloat(skipTime);
}

function updateVolume(input) {
    videoElement.volume = input;
}

function updatePlaybackRate(input) {
    videoElement.playbackRate = input;
}

function updateVideoCurrentTime(e) {
    const newCurrentTime = (e.offsetX / progressElement.offsetWidth) * videoElement.duration;
    videoElement.currentTime = newCurrentTime;
}

function initControlElement(e) {
    const target = e.target;

    if (target.className.includes(classes.PLAY_BTN) ) {
        togglePlayPauseVideoState();
        togglePlayButton();        
    } else if (target.className.includes(classes.FULL_SCREEN_BUTTON)) {
        toggleFullscreen();
    } else if (target.className.includes(classes.SKIP_BTN)) {
        skipVideo(e.target.dataset.skip);
    } else if (target.className.includes(classes.PROGRESS)) {
        updateVideoCurrentTime(e);
    } else if (target.name.includes('volume')) {        
        updateVolume(target.value);
    } else if (target.name.includes('playbackRate')) {        
        updatePlaybackRate(target.value);
    } 
}

function updateProgressElement() {
    const progressBar = document.querySelector(selectors.PROGRESS_FILLED);
    const percent = (videoElement.currentTime / videoElement.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
    setTime();
}

function listenProgressElementChanges() {    
    let mousedown = false;

    progressElement.addEventListener('mousemove', (e) => mousedown && updateVideoCurrentTime(e));
    progressElement.addEventListener('mousedown', () => mousedown = true);
    progressElement.addEventListener('mouseup', () => mousedown = false);
}

function listenVideoElementChanges() {
    videoElement.addEventListener('click', togglePlayPauseVideoState);
    videoElement.addEventListener('click', togglePlayButton);
    videoElement.addEventListener('timeupdate', updateProgressElement);
}

function init() { 
    const playerControlsContainer = document.querySelector(selectors.CONTROLS);

    listenVideoElementChanges();
    playerControlsContainer.addEventListener('click', initControlElement); 
    listenProgressElementChanges();   
}

init();