import { Drop } from './drop';
import { DropDivision2 } from './drop-division-2';
import { DropAddWithin10 } from './drop-add-within-10';
import { FinishModal } from './finish-modal';
import { gameSelectors } from './constants/selectors';
import { dropClasses } from './constants/classes';

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

export class Game {
    constructor(gameMode) {
        this.drops = [];
        this.failCounter = 0;
        this.isActive = false;
        this.gameMode = gameMode;
        this.score = 0;
        this.dropClass = this.getDropClass();
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resetScore() {
        this.score = 0;
        SCORE_CALCULATOR_ELEMENT.textContent = this.score;
        SCORE_FINISH_MODAL_WINDOW_ELEMENT.textContent = this.score;
        localStorage.removeItem('score');  
    }

    createDrop(dropIndex) {
        dropElement = new this.dropClass(dropIndex, this.notifyDestroyDrop.bind(this));
        this.drops.push(dropElement);
        dropElement.fall();
        return dropElement;
    }

    getDropClass() {
        
        switch (this.gameMode) {
            case gameMode.DIVISION_BY_2:
                return DropDivision2;
            case gameMode.ADDITION_WITHIN_10:
                return  DropAddWithin10;
            default: 
                return Drop;
        }
    }

    async start() {
        this.isActive = true;
        const interval = 3_000;           
        RAIN_AUDIO_ELEMENT.play();

        for (let i = 0; this.isActive; i++) {
            this.createDrop(i);
            await Game.sleep(interval);
        }
    }

    addScore() {
        this.score = this.score === 0 ? 10 : this.score + 1;
        SCORE_CALCULATOR_ELEMENT.textContent = this.score;
    }

    reduceScore() {
        if (this.score > 0) {
            this.score -= 1;
            SCORE_CALCULATOR_ELEMENT.textContent = this.score;
        }  
    }

    clearDropField() {
        this.drops.forEach((el) => el.kill());
        this.drops.splice(0, this.drops.length);
    }

    lowerWaves() {
        WAVE_ELEMENT_1.style.top = `${WAVE_ELEMENT_1_HEIGHT}px`;
        WAVE_ELEMENT_2.style.top = `${WAVE_ELEMENT_2_HEIGHT}px`;
        DROP_FIELD.style.height = `${DROP_FIELD_HEIGHT}px`;
    }

    stopGame(showResult = true) {
        this.isActive = false;
        this.clearDropField();
        RAIN_AUDIO_ELEMENT.pause();
                    
        this.lowerWaves();

        if (showResult) {
            const finishModalWindow = new FinishModal();
            finishModalWindow.openFinishModalWindow();
            SCORE_FINISH_MODAL_WINDOW_ELEMENT.textContent = this.score;
            localStorage.setItem('score', this.score);
        }
    }

    raiseWaves() {
        WAVE_ELEMENT_1.style.top = `${WAVE_ELEMENT_1.offsetTop / 1.1}px`;
        WAVE_ELEMENT_2.style.top = `${WAVE_ELEMENT_2.offsetTop / 1.1}px`;
        DROP_FIELD.style.height = `${DROP_FIELD.clientHeight / 1.1}px`;        
    }

    notifyDestroyDrop(drop, success) {        
        if (this.drops.includes(drop)) {
            this.drops.splice(this.drops.indexOf(drop), 1);
        }

        if (success && this.isActive) {            
            this.addScore();
            if (drop.dropSuperClass === dropClasses.SUN ) {
                this.clearDropField();
            }            
        } else {
            this.raiseWaves();
            this.failCounter += 1;
            if (this.isActive) {
                this.reduceScore();
            }

            if (this.failCounter === MAX_FAIL_COUNT) {
                this.stopGame();
            }
        }
    }

    checkResult(result) {
        const drop = this.drops[0];
        drop.checkResult(drop.result === Number(result));
    }    
}