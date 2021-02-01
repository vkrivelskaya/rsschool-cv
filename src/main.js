const selectors = {
    TIME_BTN: '.time-buttons',
    SOUND_BTN: '.sound-picker',
    TIME_BTN: '.time-buttons',
    SONG: '.song',
    VIDEO: '.video',
    PLAY: '.play',
    TIME_DISPLAY: '.time-display',
    REPLAY: '.replay',
    OUTLINE: '.moving-outline circle',
};

const song = document.querySelector(selectors.SONG);
const video = document.querySelector(selectors.VIDEO);
const play = document.querySelector(selectors.PLAY);
const replay = document.querySelector(selectors.REPLAY);
const timeDisplay = document.querySelector(selectors.TIME_DISPLAY);
let duration = 600;

function checkPlaying() {
    if (song.paused) {
        song.play();
        video.play();
        play.src = "assets/img/pause.svg";
    } else {
        song.pause();
        video.pause();
        play.src = "assets/img/play.svg";
    }    
}

function restartSong(e) {    
    song.currentTime = 0;
    song.play();
}

function pickSound(){
    const sound = document.querySelector(selectors.SOUND_BTN);

    sound.addEventListener("click", function(e) {
        song.src = e.target.getAttribute("data-sound");
        video.src = e.target.getAttribute("data-video");
        checkPlaying(song);
    });
}

function addZeroFirstFormat(value){
    return value < 10 ? '0' + value : value;
} 

function pickSoundDuration() {
    const timeSelect = document.querySelector(selectors.TIME_BTN);

    timeSelect.addEventListener("click", function(e) {
        duration = e.target.getAttribute("data-time");
        timeDisplay.textContent = 
            `${Math.floor(duration / 60)}:${addZeroFirstFormat(Math.floor(duration % 60))}`;
    });
}

function upDateProgressBar() {
    const outline = document.querySelector(selectors.OUTLINE);
    const outlineLength = outline.getTotalLength();
    const currentTime = song.currentTime;
    let progress = outlineLength - (currentTime / duration) * outlineLength;

    outline.style.strokeDashoffset = outlineLength;
    outline.style.strokeDasharray = outlineLength;
    outline.style.strokeDashoffset = progress;  
}

function upDateTime() {
    const currentTime = song.currentTime;
    const countDown = duration - currentTime;
    const seconds = Math.floor(countDown % 60);
    const minutes = Math.floor(countDown / 60);
    timeDisplay.textContent = `${minutes}:${addZeroFirstFormat(seconds)}`;

    if (currentTime >= duration) {
        song.pause();
        song.currentTime = 0;
        play.src = "assets/img/play.svg";;
        video.pause();
    }

    upDateProgressBar(); 
}

function init() {
    play.addEventListener("click", checkPlaying); 
    replay.addEventListener("click", restartSong);
    song.addEventListener("timeupdate", upDateTime);
    pickSound();
    pickSoundDuration();       
}

init();

    