const selectors = {
    CALCULATOR: '.calculator',
    BUTTONS: '.btn', 
    DISPLAY: '.display'
};

const classes = {
    CLEAN: 'clean',
    DECIMAL: 'decimal',
    NUMBER: 'number',
    OPERATION: 'operation',
    CE: 'CE',
    C: 'C',
}

const calculator = document.querySelector(selectors.CALCULATOR);
const buttons = calculator.querySelectorAll(selectors.BUTTONS);
const display = document.querySelector(selectors.DISPLAY);
let isOperationClicked = false;
let operationResult = 0;
let operation = '';

function clickNumber(btn) {    
    if (!isOperationClicked) {
        if (display.value === '0') {
            display.value = btn.innerText;
        } else {
            display.value += btn.innerText;
        }
    } else {
        display.value = btn.innerText;
        isOperationClicked = false;              
    }
};

function clickOperation(btn) {
    if (isOperationClicked) {
        operation = btn.outerText;
        return;
    }
    const numberOnDisplay = display.value;

    if (operationResult) {
        switch (operation) {
            case '+':                
                operationResult += parseFloat(numberOnDisplay);
                display.value = operationResult;                
                break;
            case '-':                
                operationResult -= parseFloat(numberOnDisplay);
                display.value = operationResult;                
                break;
            case '*':                
                operationResult *= parseFloat(numberOnDisplay);
                display.value = operationResult;
                break;
            case '/':               
                operationResult /= parseFloat(numberOnDisplay);
                display.value = operationResult;
                break;
            case '=':                
                display.value = operationResult;
                operation = '';           
                break;               
        }  
    } else {
        operationResult = parseFloat(numberOnDisplay);
        operation = btn.outerText;
    }
    operation = btn.outerText;
    isOperationClicked = true;
};

function clickClean(btn) {
    const CEButton = btn.className.includes(classes.CE);
    const CButton = btn.className.includes(classes.C);     

    if (CEButton) {
        display.value = 0;
        operation = '=';       
        
    } else if (CButton) {
        operationResult = 0;
        isOperationClicked = false;
        operation = '';
        display.value = 0;
    }
};

function clickDecimal (btn) {
    if (!display.value.includes('.')) {
        display.value += btn.innerText;
        isOperationClicked = false;
    }
} 

function init() {
    calculator.addEventListener('click', (e) => {
        if (e.target.className.includes(classes.NUMBER)) {
            clickNumber(e.target);                            
        } else if (e.target.className.includes(classes.OPERATION)) {
            clickOperation(e.target);                   
        } else if (e.target.className.includes(classes.CLEAN)) {
            clickClean(e.target);   
        } else if (e.target.className.includes(classes.DECIMAL)) {
            clickDecimal(e.target);          
        }
    });
}
 init();