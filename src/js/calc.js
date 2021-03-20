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


export class Calc {
    constructor() {
        this.displayElement = document.querySelector(selectors.DISPLAY);
        this.game = null;
    }

    showOnDisplay(output, operation = displayOperations.ADD) {
        const displayElementLength = 15;
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
        }
        this.displayElement.value = valueToStore.toString().substring(0, displayElementLength);
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
        this.game.checkResult(this.displayElement.value);
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

    init() {
        const calculatorElement = document.querySelector(selectors.CALCULATOR);
        calculatorElement.addEventListener('click', this.determineClickedButton.bind(this));
    }
}