import { Drop, DropDiv2, DropAddWithin10 } from './drop';
import { FinishModal } from './finish_modal';
import { Calc } from './calc';

export const gameSelectors = {
    RAIN_AUDIO: '.rain',    
    CALC_SCORE: '.calculator-score',
    WAVE_1: '.wave1',
    WAVE_2: '.wave2',
    DROP_FIELD: '.drop-field', 
    FINISH_SCORE: '.finish-score',
};

export const gameMode = {
    DEFAULT: 1,
    DIVISION_BY_2: 2,
    ADDITION_WITHIN_10: 3,
};

const maxFailCount = 3;
const rainAudioElement = document.querySelector(gameSelectors.RAIN_AUDIO);
const scoreCalculatorElement = document.querySelector(gameSelectors.CALC_SCORE);
const scoreFinishModalWindowElement = document.querySelector(gameSelectors.FINISH_SCORE);
const waveElement_1 = document.querySelector(gameSelectors.WAVE_1);
const waveElement_2 = document.querySelector(gameSelectors.WAVE_2);
const dropField = document.querySelector(gameSelectors.DROP_FIELD);
const wave1Height = waveElement_1.offsetTop;
const wave2Height = waveElement_2.offsetTop;
const dropFieldHeight = dropField.clientHeight;
let dropElement;
let score = 0;

export class Game {
    constructor(gameMode) {
        this.speed = 15_000;
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
        scoreCalculatorElement.textContent = score;
        scoreFinishModalWindowElement.textContent = score;
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
        const interval = 3_000;           
        rainAudioElement.play();
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
        scoreCalculatorElement.textContent = score;
    }

    subScore() {
        if (score > 0) {
            score -= 1;
            scoreCalculatorElement.textContent = score;
        }  
    }

    stopGame(showResult = true) {
        this.isActive = false;
        this.drops.forEach((el) => el.kill());
        this.drops.splice(0, this.drops.length);
        rainAudioElement.pause();
                    
        waveElement_1.style.top = wave1Height + 'px';
        waveElement_2.style.top = wave2Height + 'px';
        dropField.style.height = dropFieldHeight + 'px';
        if (showResult) {
            const finishModalWindow = new FinishModal();
            finishModalWindow.openFinishModalWindow();
            scoreFinishModalWindowElement.textContent = score;
            localStorage.setItem('score', score);
        }
    }

    raiseWaves() {
        waveElement_1.style.top = waveElement_1.offsetTop / 1.1 + 'px';
        waveElement_2.style.top = waveElement_2.offsetTop / 1.1 + 'px';
        dropField.style.height = dropField.clientHeight / 1.1 + 'px';        
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
                }
            }
        } else {
            this.raiseWaves();
            this.failCounter += 1;
            if (this.isActive) {
                this.subScore();
            }

            if (this.failCounter === maxFailCount) {
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