import { dropSelectors } from './constants/selectors';
import { dropClasses } from './constants/classes';

const SECTOR_1 = document.querySelector(dropSelectors.SECTOR_1);
const SECTOR_2 = document.querySelector(dropSelectors.SECTOR_2);
const SECTOR_3 = document.querySelector(dropSelectors.SECTOR_3);
const SECTOR_4 = document.querySelector(dropSelectors.SECTOR_4);
const SECTOR_5 = document.querySelector(dropSelectors.SECTOR_5);
const MISTAKE_AUDIO_ELEMENT = document.querySelector(dropSelectors.MISTAKE_AUDIO);
const CORRECT_ANSWER_AUDIO_ELEMENT = document.querySelector(dropSelectors.CORRECT_ANSWER_AUDIO);
const SECTORS = [SECTOR_1, SECTOR_2, SECTOR_3, SECTOR_4, SECTOR_5];
const RED_COLOR = '#FF0000';
const OPERATIONS = ['+', '-', '*', '/' ];

export class Drop {
    constructor(dropId, destroyCallback) { 
        this.speed = 14_000;    
        this.dropId = dropId;  
        this.destroyCallback = destroyCallback;
        this.number1 = this.getRandomNumber();
        this.number2 = this.getRandomNumber();
        this.operation = this.defineDifficulty();
        this.dropSuperClass = this.defineDrop();       
        this.sector = SECTORS[Math.round(Math.random() * (SECTORS.length - 1))];
        this.dropElement = null;
        this.isDestroyed = false;
    }

    static animate({timing, draw, duration}) {
        let start = performance.now();
      
        return new Promise((resolve) => {
            requestAnimationFrame(function animate(time) {
                let timeFraction = (time - start) / duration;
                if (timeFraction > 1) timeFraction = 1;  
                
                let progress = timing(timeFraction);
            
                draw(progress);
            
                if (timeFraction < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }   
            });
        });
    }

    static isIntegerNumber(num) {
        return (num ^ 0) === num;
    }

    defineDrop() {
        const isSuperDrop = this.dropId % 3 === 0 && this.dropId !== 0;

        return  isSuperDrop ? dropClasses.SUN : dropClasses.DROP;
    }

    defineDifficulty() {
        const difficulty = Math.min(0.1 * this.dropId, 1); 

        return  OPERATIONS[Math.round(Math.random() * difficulty * (OPERATIONS.length - 1))];
    }    

    getMaxNumber() {
        return 10 + 10 * Math.trunc(this.dropId / 3);
    }

    getRandomNumber() {
        const minNumber = 0;
        const maxNumber = this.getMaxNumber();

        return Math.round(Math.random() * (maxNumber - minNumber) + minNumber);
    }

    get result() {
        const operationResult = eval(`${this.number1} ${this.operation} ${this.number2}`);

        return Drop.isIntegerNumber(operationResult) 
        ? operationResult 
        : Math.round(operationResult);
    }

    createDropElement() {
        const dropElement = `<div id="drop-${this.dropId}" class="${this.dropSuperClass}">
            <div class="operation-container">
                <span class="operation">${this.operation}</span>
            </div>
            <div class="numbers-container">
                <span class="number-1">${this.number1}</span>
                <span class="number-2">${this.number2}</span>
            </div>
        </div>`;

        this.sector.insertAdjacentHTML('afterbegin', dropElement);
        this.dropElement = document.querySelector(`#drop-${this.dropId}`);
    }

    kill() {
        this.dropElement.remove();
        this.isDestroyed = true; 
    }

    destroy(success = false) {
        if (this.isDestroyed) {
            return;
        }
        this.destroyCallback(this, success);        
        
        setTimeout(() => {
            this.kill();
        }, 500);        
    }

    fall() {
        this.createDropElement();
        
        Drop.animate({
            duration: this.speed / (this.dropId * 0.3 + 0.5),
            timing: (timeFraction) => timeFraction,
            draw: (progress) => {
                const coordinate = this.sector.clientHeight - this.dropElement.clientHeight;
                this.dropElement.style.top = `${coordinate * progress}px`;
            }
        }).then(() => {
            this.destroy(); 
        });
    }

    checkResult(success) {
        if (success) {
            this.dropElement.classList.add(dropClasses.CORRECT_ANSWER);
            this.dropElement.classList.remove(this.dropSuperClass);
            this.destroy(success);
            CORRECT_ANSWER_AUDIO_ELEMENT.play();
        } else {
            this.dropElement.style.color = RED_COLOR;
            MISTAKE_AUDIO_ELEMENT.play();
        }
    }
}