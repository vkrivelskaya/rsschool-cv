export const dropSelectors = {
    RESTART_BTN: '.restart-button',
    SECTOR_1: '.sector-1',
    SECTOR_2: '.sector-2',
    SECTOR_3: '.sector-3',    
    SECTOR_4: '.sector-4',
    SECTOR_5: '.sector-5',
    WAVE_1: '.wave1',
    WAVE_2: '.wave2',
    DROP_FIELD: '.drop-field',
    MISTAKE_AUDIO: '.mistake',
    CORRECT_ANSWER_AUDIO: '.correct-answer',      
};

const classes = {
    CORRECT_ANSWER: 'correct-answer',    
    DROP: 'drop',
    SUN: 'sun',
};

const sector_1 = document.querySelector(dropSelectors.SECTOR_1);
const sector_2 = document.querySelector(dropSelectors.SECTOR_2);
const sector_3 = document.querySelector(dropSelectors.SECTOR_3);
const sector_4 = document.querySelector(dropSelectors.SECTOR_4);
const sector_5 = document.querySelector(dropSelectors.SECTOR_5);
const mistakeAudioElement = document.querySelector(dropSelectors.MISTAKE_AUDIO);
const correctAnswerAudioElement = document.querySelector(dropSelectors.CORRECT_ANSWER_AUDIO);
const sectors = [sector_1, sector_2, sector_3, sector_4, sector_5];
const redColor = '#FF0000';
const operations = ['+', '-', '*', '/' ];
export class Drop {
    constructor(game, dropId, isSuperDrop = false, difficulty) {
        this.game = game;
        this.dropId = dropId;
        this.isSuperDrop = isSuperDrop;
        this.dropClass = this.isSuperDrop ? classes.SUN : classes.DROP;
        this.difficulty = difficulty;        
        this.minNumber = 0;
        this.maxNumber = 10 + 10 * Math.trunc(dropId / 3);
        this.number1 = Math.round(Math.random() * (this.maxNumber - this.minNumber) + this.minNumber);
        this.number2 = Math.round(Math.random() * (this.maxNumber - this.minNumber) + this.minNumber);
        this.operation = operations[Math.round(Math.random() * this.difficulty * (operations.length - 1))];
        this.playButtonElement = document.querySelector(dropSelectors.PLAY_BTN);
        this.sector = sectors[Math.round(Math.random() * (sectors.length - 1))];
        this.dropElement = null;
        this.isDestroyed = false;
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
            this.dropElement.classList.add(classes.CORRECT_ANSWER);
            this.dropElement.classList.remove(this.dropClass);
            this.destroy(success);
            correctAnswerAudioElement.play();
        } else {
            this.dropElement.style.color = redColor;
            mistakeAudioElement.play();
        }
    }

    destroy(success = false) {
        if (this.isDestroyed) {
            return;
        }
        this.game.notifyDestroyDrop(this, success);
        
        this.isDestroyed = true;
        setTimeout(() => {
            this.kill();
        }, 1000);        
    }

    kill() {
        this.dropElement.remove();
        this.isDestroyed = true; 
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