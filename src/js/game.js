import { Drop, DropDiv2, DropAddWithin10 } from './drop';
import { FinishModal } from './finish_modal';
import { Calc } from './calc';
import { gameSelectors } from './constants/selectors';

export const gameMode = {
    DEFAULT: 1,
    DIVISION_BY_2: 2,
    ADDITION_WITHIN_10: 3,
};

const MAX_FAIL_COUNT = 3;
const RAIN_AUDIO_ELEMENT = document.querySelector(gameSelectors.RAIN_AUDIO);
const SCORE_CALCULATOR_ELEMENT = document.querySelector(gameSelectors.CALC_SCORE);
const SCORE_FINISH_MODAL_WINDOW_ELEMENT = document.querySelector(gameSelectors.FINISH_SCORE);
const WAVE_ELEMENT_1 = document.querySelector(gameSelectors.WAVE_1);
const WAVE_ELEMENT_2 = document.querySelector(gameSelectors.WAVE_2);
const DROP_FIELD = document.querySelector(gameSelectors.DROP_FIELD);
const WAVE_ELEMENT_1_HEIGHT = WAVE_ELEMENT_1.offsetTop;
const WAVE_ELEMENT_2_HEIGHT = WAVE_ELEMENT_2.offsetTop;
const DROP_FIELD_HEIGHT = DROP_FIELD.clientHeight;

let dropElement;
let score = 0;

export class Game {
    constructor(gameMode) {
        this.speed = 14_000;
        this.drops = [];
        this.failCounter = 0;
        this.isActive = false;
        this.gameMode = gameMode;
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resetScore() {
        score = 0;
        SCORE_CALCULATOR_ELEMENT.textContent = score;
        SCORE_FINISH_MODAL_WINDOW_ELEMENT.textContent = score;
        localStorage.removeItem('score');  
    }

    createDrop(dropClass, dropIndex) {
        dropElement = new dropClass(this, dropIndex, (dropIndex % 3 === 0 && dropIndex !== 0), Math.min(0.1 * dropIndex, 1));
        this.drops.push(dropElement);
        dropElement.fall();
        return dropElement;
    }

    async start() {
        this.isActive = true;
        const interval = 5_000;           
        RAIN_AUDIO_ELEMENT.play();
        let dropClass = Drop;
        switch (this.gameMode) {
            case gameMode.DIVISION_BY_2:
                dropClass = DropDiv2;
                break;
            case gameMode.ADDITION_WITHIN_10:
                dropClass = DropAddWithin10;
                break; 
        }

        for (let i = 0; this.isActive; i++) {
            this.createDrop(dropClass, i);
            await Game.sleep(interval);
            this.speed *= 1 / 1.07;
        }
    }

    addScore() {
        score = score === 0 ? 10 : score + 1;
        SCORE_CALCULATOR_ELEMENT.textContent = score;
    }

    subScore() {
        if (score > 0) {
            score -= 1;
            SCORE_CALCULATOR_ELEMENT.textContent = score;
        }  
    }

    stopGame(showResult = true) {
        this.isActive = false;
        this.drops.forEach((el) => el.kill());
        this.drops.splice(0, this.drops.length);
        RAIN_AUDIO_ELEMENT.pause();
                    
        WAVE_ELEMENT_1.style.top = WAVE_ELEMENT_1_HEIGHT + 'px';
        WAVE_ELEMENT_2.style.top = WAVE_ELEMENT_2_HEIGHT + 'px';
        DROP_FIELD.style.height = DROP_FIELD_HEIGHT + 'px';

        if (showResult) {
            const finishModalWindow = new FinishModal();
            finishModalWindow.openFinishModalWindow();
            SCORE_FINISH_MODAL_WINDOW_ELEMENT.textContent = score;
            localStorage.setItem('score', score);
        }
    }

    raiseWaves() {
        WAVE_ELEMENT_1.style.top = WAVE_ELEMENT_1.offsetTop / 1.1 + 'px';
        WAVE_ELEMENT_2.style.top = WAVE_ELEMENT_2.offsetTop / 1.1 + 'px';
        DROP_FIELD.style.height = DROP_FIELD.clientHeight / 1.1 + 'px';        
    }

    notifyDestroyDrop(drop, success) {
        const dropIndex = this.drops.indexOf(drop);

        if (dropIndex > -1) {
            this.drops.splice(dropIndex, 1);
        }

        if (success) {
            if (this.isActive) {
                this.addScore();
                if (drop.isSuperDrop) {
                    this.drops.forEach((el) => el.kill());
                    this.drops.splice(0, this.drops.length);
                }
            }
        } else {
            this.raiseWaves();
            this.failCounter += 1;
            if (this.isActive) {
                this.subScore();
            }

            if (this.failCounter === MAX_FAIL_COUNT) {
                this.stopGame();
            }
        }
    }

    checkResult(result) {
        const drop = this.drops[0];
        drop.checkResult(drop.result == result);
    }    
}

export class DemoGame extends Game {    
    createDrop(dropClass, dropIndex) {    
        const calcButtons = Calc.getButtons();
        const drop = super.createDrop(dropClass, dropIndex);
        const demoResult = dropIndex !== 4 ? drop.result : Math.round(Math.random() * (drop.result - 1));
        
        setTimeout(() => {
            String(demoResult).split('').forEach((el) => {
                calcButtons[el].dispatchEvent(new Event('click', {bubbles: true}));
            });
        }, 2000);
        setTimeout(() => {            
            calcButtons['Enter'].dispatchEvent(new Event('click', {bubbles: true})); 
        }, 2500);        
    }
}