import 'regenerator-runtime/runtime';
import './styles/style.scss';
import { Calc } from './js/calc';
import { Game } from './js/game';
import { StartModal } from './js/start_modal';
import { dropSelectors } from './js/drop';
import { startModalWindowSelectors } from './js/start_modal';

const playButtonElement = document.querySelector(dropSelectors.PLAY_BTN);
const playButtonModalElement = document.querySelector(startModalWindowSelectors.PLAY_BTN);
const closeButtonModalElement = document.querySelector(startModalWindowSelectors.CLOSE_BTN);
let calc;
let startModalWindow;

function onPlayButtonClick() {
    playButtonElement.textContent = playButtonElement.textContent === '↺' ? '▶' : '↺';
    const game = new Game();
    calc.game = game;
    game.start();    
}

function startGame() {
    startModalWindow.closeStartModalWindow();
    onPlayButtonClick();
}

function init() {
    calc = new Calc();
    calc.init();
    startModalWindow = new StartModal();
    startModalWindow.openStartModalWindow();
    playButtonElement.addEventListener('click', onPlayButtonClick);   
    playButtonModalElement.addEventListener('click', startGame);
    closeButtonModalElement.addEventListener('click', startModalWindow.closeStartModalWindow);
}

init();