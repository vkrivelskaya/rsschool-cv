import 'regenerator-runtime/runtime';
import './styles/style.scss';

import { Calc } from './js/calc';
import { Game, gameMode } from './js/game';
import { DemoGame } from './js/demo-game';
import { StartModal } from './js/start-modal';
import { dropSelectors } from './js/constants/selectors';
import { startModalWindowSelectors } from './js/constants/selectors';
import { radioButtons } from './js/constants/constants';

const RESTART_BUTTON_ELEMENT = document.querySelector(dropSelectors.RESTART_BTN);
const PLAY_BUTTON_ELEMENT = document.querySelector(startModalWindowSelectors.PLAY_BTN);
const HOW_TO_PLAY_BUTTON_ELEMENT = document.querySelector(startModalWindowSelectors.HOW_T0_PLAY_BTN);
const CLOSE_BUTTON_MODAL_ELEMENT = document.querySelector(startModalWindowSelectors.CLOSE_BTN);
const RADIO_BUTTONS = document.querySelectorAll('[type="radio"]');

const environment = {
    currentGame: null,
    calc: null,    
};

function getGameMode() {
    const checkedRadioButtons = Array.from(RADIO_BUTTONS).find((el) => el.checked);
    
    switch (checkedRadioButtons?.value) {
        case radioButtons.divisionByTwo: 
            return gameMode.DIVISION_BY_2;
        case radioButtons.additionWithinTen:
            return gameMode.ADDITION_WITHIN_10;  
        default: 
            return gameMode.DEFAULT;      
    }  
}

function openStartModalWindow(startModalWindow) {
    startModalWindow.openStartModalWindow();
}

function onRestartButtonClick(startModalWindow) {
    if (environment.currentGame?.isActive) {
        environment.currentGame.stopGame(false);
        environment.currentGame = null;
    }           
    openStartModalWindow(startModalWindow);
}

function startGame(isDemo = false, startModalWindow) {
    const gameClass = isDemo ? DemoGame: Game;

    startModalWindow.closeStartModalWindow();
    environment.currentGame = new gameClass(getGameMode());
    if (!environment.calc) {
        environment.calc = new Calc();
        environment.calc.init();
    }
    environment.calc.setCurrentGame(environment.currentGame);
    environment.currentGame.resetScore(); 
    environment.currentGame.start();
}

function onDemoGamePlay(startModalWindow) {
    startGame(true, startModalWindow);
} 

function onPlayGame(startModalWindow) {
    startGame(false, startModalWindow); 
}

function init() {
    const startModalWindow = new StartModal();

    HOW_TO_PLAY_BUTTON_ELEMENT.addEventListener('click', onDemoGamePlay.bind(this, startModalWindow));  
    openStartModalWindow(startModalWindow);    
    PLAY_BUTTON_ELEMENT.addEventListener('click', onPlayGame.bind(this, startModalWindow));
    RESTART_BUTTON_ELEMENT.addEventListener('click', onRestartButtonClick.bind(this, startModalWindow)); 
    CLOSE_BUTTON_MODAL_ELEMENT.addEventListener('click', startModalWindow.closeStartModalWindow.bind(startModalWindow));
}

init();