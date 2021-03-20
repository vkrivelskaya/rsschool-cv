import 'regenerator-runtime/runtime';
import './styles/style.scss';
import { Calc } from './js/calc';
import { Game } from './js/game';
import { selectors } from './js/drop';

let calc;

function onPlayButtonClick() {
    const game = new Game();
    calc.game = game;
    game.start();    
}

function init() {
    const playButtonElement = document.querySelector(selectors.PLAY_BTN);
    calc = new Calc();
    calc.init();
    playButtonElement.addEventListener('click', onPlayButtonClick);   
}

init();