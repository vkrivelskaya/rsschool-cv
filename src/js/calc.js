import { calcSelectors } from './constants/selectors';
import { calcClasses } from './constants/classes';
import { keyCodes } from './constants/constants';

const displayOperations = {
    ADD: 1,
    REMOVE: 2,
    REPLACE: 3
};

export class Calc {    
    constructor() {
        this.displayElement = document.querySelector(calcSelectors.DISPLAY);
        this.game = null;
        this.calcArray = ['Digit1', 'Digit2', 'Digit3','Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Enter', 'Backspace', 'Delete', 'Minus'];
    }

    setCurrentGame(game) {
        this.game = game;
    }

    static getButtons() {
        const btnContainer = document.querySelectorAll(calcSelectors.BTN);
        
        return Array.from(btnContainer).reduce((acc, el) => ({...acc, [el.outerText] : el }), {});              
    }

    showOnDisplay(output, operation = displayOperations.ADD) {
        const displayElementLength = 10;
        let valueToStore = this.displayElement.value;
        switch (operation) {
            case displayOperations.ADD: {
                valueToStore += output;
                break;
            }
            case displayOperations.REMOVE: {
                valueToStore = valueToStore.toString().slice(0, -1);
                break;
            }
            case displayOperations.REPLACE: {
                valueToStore = output;
                break;
            }

            default:
        }
        this.displayElement.value = valueToStore.toString().substring(0, displayElementLength);
    }

    onNumberClick({innerText}) { 
        this.showOnDisplay(innerText); 
    }

    onCleanClick(btn) {
        const isCEButton = btn.className.includes(calcClasses.CE);
        const isCButton = btn.className.includes(calcClasses.C); 

        if (isCButton) {
            this.showOnDisplay('', displayOperations.REPLACE);
        } else if (isCEButton) {
            this.showOnDisplay('', displayOperations.REMOVE);
        } 
    } 
    
    onEnterClick() {
        this.game.checkResult(this.displayElement.value);
        this.showOnDisplay('', displayOperations.REPLACE);
    }

    determineClickedButton(e) {
        const target = e.target;

        if (target.className.includes(calcClasses.NUMBER)) {
            this.onNumberClick(target);                            
        } else if (target.className.includes(calcClasses.OPERATION)) {
            this.onEnterClick(target);                   
        } else if (target.className.includes(calcClasses.CLEAN)) {
            this.onCleanClick(target);   
        } 
    }

    onKeyDown(e) {
        if (this.calcArray.includes(e.code)) {
            switch (e.code) {
                case keyCodes.enter: 
                    this.onEnterClick();
                    break;
                
                case keyCodes.delete:
                case keyCodes.backspace: 
                    this.showOnDisplay('', displayOperations.REMOVE);
                    break;
                default: 
                    this.showOnDisplay(e.key);
            }             
        }             
    }       

    init() {
        const calculatorElement = document.querySelector(calcSelectors.CALCULATOR);
        calculatorElement.addEventListener('click', this.determineClickedButton.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }
}