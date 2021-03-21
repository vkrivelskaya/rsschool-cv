export const dropSelectors = {
    PLAY_BTN: '.play-button',
    SECTOR_1: '.sector-1',
    SECTOR_2: '.sector-2',
    SECTOR_3: '.sector-3',    
    SECTOR_4: '.sector-4',
    SECTOR_5: '.sector-5',
    WAVE_1: '.wave1',
    WAVE_2: '.wave2',
    DROP_FIELD: '.drop-field',    
};

const classes = {
    CORRECT_ANSWER: 'correct-answer',
    DROP: 'drop',
};

const operations = ['+', '-'];
const sector_1 = document.querySelector(dropSelectors.SECTOR_1);
const sector_2 = document.querySelector(dropSelectors.SECTOR_2);
const sector_3 = document.querySelector(dropSelectors.SECTOR_3);
const sector_4 = document.querySelector(dropSelectors.SECTOR_4);
const sector_5 = document.querySelector(dropSelectors.SECTOR_5);
const sectors = [sector_1, sector_2, sector_3, sector_4, sector_5];
const redColor = '#FF0000';
const waveElement_1 = document.querySelector(dropSelectors.WAVE_1);
const waveElement_2 = document.querySelector(dropSelectors.WAVE_2);
const dropField = document.querySelector(dropSelectors.DROP_FIELD);
export class Drop {
    constructor(game, dropId) {
        this.game = game;
        this.dropId = dropId;
        this.min = 1;
        this.max = 10;
        this.number1 = Math.round(Math.random() * (this.max - this.min) + this.min);
        this.number2 = Math.round(Math.random() * (this.max - this.min) + this.min);
        this.operation = operations[Math.round(Math.random() * (operations.length - 1))];
        this.playButtonElement = document.querySelector(dropSelectors.PLAY_BTN);
        this.sector = sectors[Math.round(Math.random() * (sectors.length - 1))];
        this.result = eval(`${this.number1} ${this.operation} ${this.number2}`);
        this.dropElement = null;
        this.isDestroyed = false;
    }

    createDropElement() {
        const dropElement = `<div id="drop-${this.dropId}" class="drop">
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

    raise() {
        waveElement_1.style.top = waveElement_1.offsetTop / 1.1 + 'px';
        waveElement_2.style.top = waveElement_2.offsetTop / 1.1 + 'px';
        dropField.style.height = dropField.clientHeight / 1.1 + 'px';        
    }

    destroy(success = false) {
        if (this.isDestroyed) {
            return;
        }
        this.game.notifyDestroyDrop(this, success);
        if (success) {
            this.dropElement.classList.add(classes.CORRECT_ANSWER);
            this.dropElement.classList.remove(classes.DROP);
        } else {
            this.dropElement.style.color = redColor;            
            this.raise();
        }
        this.isDestroyed = true;
        setTimeout(() => {
            this.kill();
        }, 1000);        
    }

    kill() {
        this.dropElement.remove(); 
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
}