import { Drop } from './drop';
import { FinishModal } from './finish_modal';

const gameSelectors = {
    RAIN_AUDIO: '.rain',
    MISTAKE_AUDIO: '.mistake',
    CORRECT_ANSWER_AUDIO: '.correct-answer',
    SCORE: '.calculator-score',
};

const maxFailCount = 3;
const rainAudioElement = document.querySelector(gameSelectors.RAIN_AUDIO);
const mistakeAudioElement = document.querySelector(gameSelectors.MISTAKE_AUDIO);
const correctAnswerAudioElement = document.querySelector(gameSelectors.CORRECT_ANSWER_AUDIO);
const scoreElement = document.querySelector(gameSelectors.SCORE);
let dropElement;
let score = null;

export class Game {
    constructor() {
        this.speed = 10_000;
        this.drops = [];
        this.failCounter = 0;
        this.isActive = false;
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async start() {
        this.isActive = true;
        const interval = 5_000;        
        rainAudioElement.play();
        for (let i = 0; this.isActive; i++) {
            dropElement = new Drop(this, i);
            this.drops.push(dropElement);
            dropElement.fall();
            await Game.sleep(interval);
            this.speed *= 1 / 1.1;
        }
    }

    addScore() {
        score = score === null ? 10 : score + 1;
        scoreElement.textContent = score;
    }

    subScore() {
        if (score > 0) {
            score -= 1;
            scoreElement.textContent = score;
        }  
    }

    stopGame() {
        const finishModalWindow = new FinishModal();

        this.isActive = false;
        this.drops.forEach((el) => el.kill());
        this.drops.splice(0, this.drops.length);
        rainAudioElement.pause();
        localStorage.setItem('score', score);        
        finishModalWindow.openFinishModalWindow();
    }

    notifyDestroyDrop(drop, success) {
        const dropIndex = this.drops.indexOf(drop);

        if (dropIndex > -1) {
            this.drops.splice(dropIndex, 1);
        }
        
        if (success) {
            correctAnswerAudioElement.play(); 
            if (this.isActive)   {
                this.addScore();
            }
        } else {
            mistakeAudioElement.play();
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
        drop.destroy(drop.result == result);
    }    
}