export const selectors = {
    DISPLAY: '.display',
    CALCULATOR: '.calculator',
};

export const classes = {
   NUMBER: 'number',
   OPERATION: 'operation',
   CLEAN: 'clean',
   CE: 'CE-button',
   C: 'C-button',

};

export const displayOperations = {
    ADD: 1,
    REMOVE: 2,
    REPLACE: 3
};

const displayElement = document.querySelector(selectors.DISPLAY);
export class Calc {    
    constructor() {
        this.game = null;
        this.calcArray = ['Digit1', 'Digit2', 'Digit3','Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Enter', 'Backspace', 'Delete', 'Minus'];
    }

    static getButtons() {
        const btnContainer = document.querySelectorAll('.btn');
        const buttons = [];
        btnContainer.forEach((el) => buttons[el.outerText] = el);
        return buttons;
    }

    showOnDisplay(output, operation = displayOperations.ADD) {
        const displayElementLength = 10;
        let valueToStore = displayElement.value;
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
        }
        displayElement.value = valueToStore.toString().substring(0, displayElementLength);
    }

    onNumberClick({innerText}) { 
        this.showOnDisplay(innerText); 
    }

    onCleanClick(btn) {
        const isCEButton = btn.className.includes(classes.CE);
        const isCButton = btn.className.includes(classes.C); 

        if (isCButton) {
            this.showOnDisplay('', displayOperations.REPLACE);
        } else if (isCEButton) {
            this.showOnDisplay('', displayOperations.REMOVE);
        } 
    } 
    
    onOperationClick() {
        this.game.checkResult(displayElement.value);
        this.showOnDisplay('', displayOperations.REPLACE);
    }

    determineClickedButton(e) {
        const target = e.target;

        if (target.className.includes(classes.NUMBER)) {
            this.onNumberClick(target);                            
        } else if (target.className.includes(classes.OPERATION)) {
            this.onOperationClick(target);                   
        } else if (target.className.includes(classes.CLEAN)) {
            this.onCleanClick(target);   
        } 
    }

    onKeyDown(e) {
        if (this.calcArray.includes(e.code)) {
            if (e.code === 'Enter') {
                this.onOperationClick();
            } else if (e.code === 'Backspace' || e.code === 'Delete') {
                this.showOnDisplay('', displayOperations.REMOVE);
            } else {
                this.showOnDisplay(e.key);
            }   
        }             
    }       

    init() {
        const calculatorElement = document.querySelector(selectors.CALCULATOR);
        calculatorElement.addEventListener('click', this.determineClickedButton.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }
}