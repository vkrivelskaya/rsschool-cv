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
    constructor(game, dropId, isSuperDrop = false, difficulty) {
        this.game = game;
        this.dropId = dropId;
        this.isSuperDrop = isSuperDrop;
        this.dropClass = this.isSuperDrop ? dropClasses.SUN : dropClasses.DROP;
        this.difficulty = difficulty;        
        this.minNumber = 0;
        this.maxNumber = 10 + 10 * Math.trunc(dropId / 3);
        this.number1 = Math.round(Math.random() * (this.maxNumber - this.minNumber) + this.minNumber);
        this.number2 = Math.round(Math.random() * (this.maxNumber - this.minNumber) + this.minNumber);
        this.operation = OPERATIONS[Math.round(Math.random() * this.difficulty * (OPERATIONS.length - 1))];
        this.playButtonElement = document.querySelector(dropSelectors.PLAY_BTN);
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

    static isInteger(num) {
        return (num ^ 0) === num;
    }

    get result() {
        return Drop.isInteger(eval(`${this.number1} ${this.operation} ${this.number2}`)) 
        ? eval(`${this.number1} ${this.operation} ${this.number2}`) 
        : Math.round(eval(`${this.number1} ${this.operation} ${this.number2}`));
    }

    createDropElement() {
        const dropElement = `<div id="drop-${this.dropId}" class="${this.dropClass}">
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
        this.game.notifyDestroyDrop(this, success);
        
        this.isDestroyed = true;
        setTimeout(() => {
            this.kill();
        }, 500);        
    }

    fall() {
        this.createDropElement();
        
        Drop.animate({
            duration: this.game.speed,
            timing: function(timeFraction) {
                return timeFraction;
            },
            draw: (progress) => {
                const coordinate = this.sector.clientHeight - this.dropElement.clientHeight;
                this.dropElement.style.top = coordinate * progress + 'px';
            }
        }).then(() => {
            this.destroy(); 
        });
    }

    checkResult(success) {
        if (success) {
            this.dropElement.classList.add(dropClasses.CORRECT_ANSWER);
            this.dropElement.classList.remove(this.dropClass);
            this.destroy(success);
            CORRECT_ANSWER_AUDIO_ELEMENT.play();
        } else {
            this.dropElement.style.color = RED_COLOR;
            MISTAKE_AUDIO_ELEMENT.play();
        }
    }
}
export class DropDiv2 extends Drop {
    constructor(...args) {
        super(...args);
        this.number2 = 2;
        this.operation = '/';
    }
}

export class DropAddWithin10 extends Drop {
    constructor(...args) {
        super(...args);
        this.maxNumber = 10;
        this.operation = '+';
        this.number2 = Math.round(Math.random() * (this.maxNumber - this.minNumber) + this.minNumber);
    }
}