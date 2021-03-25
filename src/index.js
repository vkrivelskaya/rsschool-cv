import 'regenerator-runtime/runtime';
import './styles/style.scss';
import { Calc } from './js/calc';
import { Game, DemoGame, gameMode } from './js/game';
import { StartModal } from './js/start_modal';
import { dropSelectors } from './js/drop';
import { startModalWindowSelectors } from './js/start_modal';

const restartButtonElement = document.querySelector(dropSelectors.RESTART_BTN);
const playButtonElement = document.querySelector(startModalWindowSelectors.PLAY_BTN);
const howToPlayButtonElement = document.querySelector(startModalWindowSelectors.HOW_T0_PLAY_BTN);
const closeButtonModalElement = document.querySelector(startModalWindowSelectors.CLOSE_BTN);
const radioButtons = document.querySelectorAll('[type="radio"]');

let calc;
let startModalWindow;
let currentGame;

function getGameMode() {
    const checkedRadioButtons = Array.from(radioButtons).filter((el) => el.checked);
    if (checkedRadioButtons.length === 0) {
        return gameMode.DEFAULT;
    } 
    switch (checkedRadioButtons[0].value) {
        case 'division-by-two': 
            return gameMode.DIVISION_BY_2;
        case 'addition-within-ten':
            return gameMode.ADDITION_WITHIN_10;  
        case 'default':
            return gameMode.DEFAULT;      
    }

    return gameMode.DEFAULT;    
}

function openStartModalWindow() {
    startModalWindow.openStartModalWindow();
    playButtonElement.addEventListener('click', onPlayGame);
}

function onRestartButtonClick() {
    if (currentGame && currentGame.isActive) {
        currentGame.stopGame(false);
        currentGame = null;
    }           
    openStartModalWindow();
}

function startGame(isDemo = false) {
    const gameClass = isDemo ? DemoGame: Game;

    startModalWindow.closeStartModalWindow();
    currentGame = new gameClass(getGameMode());
    calc.game = currentGame;
    currentGame.resetScore(); 
    currentGame.start();
}

function onPlayGame() {
    startGame(); 
}

function onDemoGamePlay() {
    startGame(true);
} 

function init() {
    howToPlayButtonElement.addEventListener('click', onDemoGamePlay);
    calc = new Calc();
    calc.init();
    startModalWindow = new StartModal();
    openStartModalWindow();
    restartButtonElement.addEventListener('click', onRestartButtonClick); 
    closeButtonModalElement.addEventListener('click', startModalWindow.closeStartModalWindow.bind(startModalWindow));
}

init();