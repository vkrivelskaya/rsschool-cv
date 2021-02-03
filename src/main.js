const selectors = {
    TIME_BTN: '.time-buttons',
    SOUND_BTN: '.sound-picker',
    SONG: '.song',
    VIDEO: '.video',
    PLAY: '.play',
    TIME_DISPLAY: '.time-display',
    REPLAY: '.replay',
    OUTLINE: '.moving-outline circle',
};

const songElement = document.querySelector(selectors.SONG);
const videoElement = document.querySelector(selectors.VIDEO);
const playButtonElement = document.querySelector(selectors.PLAY);
const replayButtonElement = document.querySelector(selectors.REPLAY);
const timeDisplayElement = document.querySelector(selectors.TIME_DISPLAY);
let duration = 600;

function pauseSong() {
    songElement.pause();
    videoElement.pause();
    playButtonElement.src = "assets/img/play.svg";
}

function playSong() {
    songElement.play();
    videoElement.play();
    playButtonElement.src = "assets/img/pause.svg";
}

function updatePlaying() {
    if (songElement.paused) {
        playSong();
    } else {
        pauseSong();
    }    
}

function restartSong(e) {    
    songElement.currentTime = 0;
    songElement.play();
}

function pickSound() {
    const sound = document.querySelector(selectors.SOUND_BTN);

    sound.addEventListener("click", function(e) {
        songElement.src = e.target.getAttribute("data-sound");
        videoElement.src = e.target.getAttribute("data-video");
        updatePlaying();
    });
}

function addZeroToFormat(value) {
    return value < 10 ? '0' + value : value;
} 

function pickSoundDuration() {
    const timeButtonsContainerElement = document.querySelector(selectors.TIME_BTN);

    timeButtonsContainerElement.addEventListener("click", function(e) {
        duration = e.target.getAttribute("data-time");
        timeDisplayElement.textContent = 
            `${Math.floor(duration / 60)}:${addZeroToFormat(Math.floor(duration % 60))}`;
    });
}

function updateProgressBar() {
    const outline = document.querySelector(selectors.OUTLINE);
    const outlineLength = outline.getTotalLength();
    const currentTime = songElement.currentTime;
    const progress = outlineLength - (currentTime / duration) * outlineLength;

    outline.style.strokeDashoffset = outlineLength;
    outline.style.strokeDasharray = outlineLength;
    outline.style.strokeDashoffset = progress;  
}

function updateTime() {
    const currentTime = songElement.currentTime;
    const countDown = duration - currentTime;
    const seconds = Math.floor(countDown % 60);
    const minutes = Math.floor(countDown / 60);  

    if (countDown < 0) {
        pauseSong();
        songElement.currentTime = 0;
    } else {
        timeDisplayElement.textContent = `${minutes}:${addZeroToFormat(seconds)}`;
    }

    updateProgressBar(); 
}

function init() {
    playButtonElement.addEventListener("click", updatePlaying); 
    replayButtonElement.addEventListener("click", restartSong);
    songElement.addEventListener("timeupdate", updateTime);
    pickSound();
    pickSoundDuration();       
}

init();
    