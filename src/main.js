const selectors = {
    KEY: '.key',
    BUTTONS: '.keys',    
};

const classes = {
    PLAYING: 'playing',
}

function playSound(keyCode) {
    const audio = document.querySelector(`audio[data-key='${keyCode}']`);
    const key = document.querySelector(`div[data-key='${keyCode}']`);
    if (!audio) return;
    
    key.classList.add(classes.PLAYING);
    audio.currentTime = 0;
    audio.play();
}

function onKeyDown(e) { 
    playSound(e.keyCode);
}

function getKeyFromElement(element, lastParent) {    
    let key;
    while (true) {
        key = element.getAttribute('data-key');
        if (key || element === lastParent) {
            break;
        }
        element = element.parentElement;
    }
    return key;
}

function onClick(e) { 
    const key = getKeyFromElement(e.target, this);   
    if (key) {
        playSound(key);
    }    
}

function removeClassPlaying(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove(classes.PLAYING);
}

function init() {    
    const buttons = document.querySelector(selectors.BUTTONS);
    
    buttons.addEventListener('transitionend', removeClassPlaying);    
    window.addEventListener('keydown', onKeyDown);
    buttons.addEventListener('click', onClick);
}

init();
  