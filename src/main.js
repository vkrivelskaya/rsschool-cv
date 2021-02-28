const selectors = {
    HOLE: '.hole',
    GAME: '.game',
    START_BTN: '.start',
    SCORE:'.score',
    MODAL: '.modal',
    UP: '.up',
    HOLE_7: '.hole-7',
    HOLE_8: '.hole-8',
};

const classes = {
    MOLE: 'mole',
    UP: 'up',
    ACTIVE: 'active',
    CLOSE: 'close',
    REPEAT_BTN: 'repeat-level-button',
    NEXT_LEVEL_BTN: 'next-level-button',
    NEW_GAME_BTN: 'new-game-button',
    NEXT_LEVEL: 'next-level',
};

const holes = document.querySelectorAll(selectors.HOLE);
const scoreBoardElement = document.querySelector(selectors.SCORE);
const modalWindowElement = document.querySelector(selectors.MODAL);
const hole7Element = document.querySelector(selectors.HOLE_7);
const hole8Element = document.querySelector(selectors.HOLE_8);
const minRate = 200;
const maxRate = 3000;
const gameDuration = 10000;
let score = 0;
let minMoleDisappearanceRate;
let maxMoleDisappearanceRate;
let timerId;
let lastHole;
let isGameFinished = false;

function getRandomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function getRandomHole(holes) {    
    const holesRandomElementIndex = Math.floor(Math.random() * holes.length);
    const newHole = holes[holesRandomElementIndex];    

    if (newHole === lastHole) {
        return getRandomHole(holes);
    }
    lastHole = newHole;
    return newHole;  
}

function peepMole() {
    const time = getRandomTime(minMoleDisappearanceRate, maxMoleDisappearanceRate);
    const hole = getRandomHole(holes);

    if(!isGameFinished) {
        hole.classList.add(classes.UP);
        timerId = setTimeout(() => {
            hole.classList.remove(classes.UP);
            peepMole();
        }, time);         
    }        
}

function saveLevelDataToLocalStorage() {
    localStorage.setItem('score', score);
    localStorage.setItem('min', minMoleDisappearanceRate);
    localStorage.setItem('max', maxMoleDisappearanceRate);
}

function finishGame() {
    isGameFinished = true;
    document.querySelectorAll(selectors.UP).forEach((el) => el.classList.remove(classes.UP));
    saveLevelDataToLocalStorage();
    clearTimeout(timerId);
    modalWindowElement.classList.add(classes.ACTIVE);
}

function startLevel() {
    isGameFinished = false;
    peepMole();
    setTimeout(finishGame, gameDuration);
}

function startGame() {    
    score = Number(localStorage.getItem('score') || 0);
    minMoleDisappearanceRate = localStorage.getItem('min') || minRate;
    maxMoleDisappearanceRate = localStorage.getItem('max') || maxRate;
    startLevel();     
}

function whackMole(e) {
    if(!e.isTrusted) return;
    if (e.target.className.includes(classes.MOLE)) {
        score += 1; 
        e.target.parentNode.classList.remove(classes.UP);
        scoreBoardElement.textContent = score;
    }    
}

function closeModalWindow() {
    modalWindowElement.classList.remove(classes.ACTIVE);
}

function repeatLevel() {
    closeModalWindow(); 
    startLevel();
}

function goToNextLevel() {
    minMoleDisappearanceRate *= 0.8;
    maxMoleDisappearanceRate *= 0.7;
    closeModalWindow();
    holes.forEach((el) => el.classList.add(classes.NEXT_LEVEL));
    hole7Element.classList.add(classes.ACTIVE);    
    hole8Element.classList.add(classes.ACTIVE);
    startLevel();    
}

function cleanUpLevelDataFromLocalStorage() {
    localStorage.removeItem('score');
    localStorage.removeItem('min');
    localStorage.removeItem('max');
}

function startNewGame() {
    cleanUpLevelDataFromLocalStorage();
    scoreBoardElement.textContent = 0;
    closeModalWindow();    
    score = 0;
    minMoleDisappearanceRate = minRate;
    maxMoleDisappearanceRate = maxRate;
    startLevel(); 
}

function determineModalWindowElement(e) {
    const target = e.target.className;
    if (target.includes(classes.CLOSE)) {
        closeModalWindow();
        return;
    }

    if (target.includes(classes.REPEAT_BTN)) {
        repeatLevel();
        return;
    }

    if (target.includes(classes.NEXT_LEVEL_BTN)) {
        goToNextLevel();
        return;
    }

    if (target.includes(classes.NEW_GAME_BTN)) {        
        startNewGame();
        return;
    }
}

function setupInitialLevel() {
    minMoleDisappearanceRate = localStorage.getItem('min') || minRate;
    maxMoleDisappearanceRate = localStorage.getItem('max') || maxRate;

    if (minMoleDisappearanceRate < minRate && maxMoleDisappearanceRate < maxRate) {
        holes.forEach((el) => el.classList.add(classes.NEXT_LEVEL));
        hole7Element.classList.add(classes.ACTIVE);    
        hole8Element.classList.add(classes.ACTIVE);
    }
    scoreBoardElement.textContent = Number(localStorage.getItem('score') || 0);   
}

function init() {
    const gameContainerElement = document.querySelector(selectors.GAME);
    const startButtonElement = document.querySelector(selectors.START_BTN);

    setupInitialLevel();
    startButtonElement.addEventListener('click', startGame);
    gameContainerElement.addEventListener('click', whackMole);
    modalWindowElement.addEventListener('click', determineModalWindowElement);
}

init();