const selectors = {
    KEY: '.key',
    BUTTONS: '.keys',    
};

const classes = {
    PLAYING: 'playing',
}

function onKeyDown(e) {  
    playSound(e.keyCode);
}

function onClick(e) {
    let target = e.target;
    let key;
    while (true) {
        key = target.getAttribute('data-key');
        if (key || target === this) {
            break;
        }
        target = target.parentElement;
    }
    playSound(key);
}

function playSound(keyCode) {
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
    const key = document.querySelector(`div[data-key="${keyCode}"]`);
    if (!audio) return;
    
    key.classList.add(classes.PLAYING);
    audio.currentTime = 0;
    audio.play();
}

function removeClassPlaying(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove(classes.PLAYING);
}

function init() {
    const keys = Array.from(document.querySelectorAll(selectors.KEY));
    const buttons = document.querySelector(selectors.BUTTONS);

    keys.forEach(key => key.addEventListener('transitionend', removeClassPlaying));
    window.addEventListener('keydown', onKeyDown);
    buttons.addEventListener('click', onClick);
}

init();



  