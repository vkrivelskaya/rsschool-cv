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
};

const calculator = document.querySelector(selectors.CALCULATOR);
const buttons = calculator.querySelectorAll(selectors.BUTTONS);
const display = document.querySelector(selectors.DISPLAY);
const displayLength = 13;
let isOperationClicked = false;
let operationResult = 0;
let operation = '';

function showOnDisplay(output, append=false) {
    if (append) {
        if (display.value.length == displayLength){
            return;
        }
        display.value += output;
    } else {
        display.value = output.toString().substring(0, displayLength);
    }
}

function clickNumber(btn) {  
    if (!isOperationClicked) { 
        showOnDisplay(btn.innerText, display.value !== '0');
    } else {
        showOnDisplay(btn.innerText);        
        isOperationClicked = false;              
    }
}

function clickOperation(btn) {
    if (isOperationClicked) {
        operation = btn.outerText;
        return;
    }
    const numberOnDisplay = display.value;
    
        switch (operation) {
            case '+':                
                operationResult += parseFloat(numberOnDisplay);
                showOnDisplay(operationResult);                              
                break;
            case '-':                
                operationResult -= parseFloat(numberOnDisplay);
                showOnDisplay(operationResult);                               
                break;
            case '*':                
                operationResult *= parseFloat(numberOnDisplay);
                showOnDisplay(operationResult);                 
                break;
            case '/':               
                operationResult /= parseFloat(numberOnDisplay);
                showOnDisplay(operationResult);
                break;        
            default:
                operationResult = parseFloat(numberOnDisplay);
                operation = btn.outerText;                 
        }

    if (btn.outerText === '=') {
        showOnDisplay(operationResult);
        operation = ''; 
    } else {
        operation = btn.outerText;
    }
    isOperationClicked = true;
}

function clickClean(btn) {
    const CEButton = btn.className.includes(classes.CE);
    const CButton = btn.className.includes(classes.C);     

    if (CEButton) {
        showOnDisplay(0);
        isOperationClicked = true;       
        
    } else if (CButton) {
        operationResult = 0;
        isOperationClicked = false;
        operation = '';
        showOnDisplay(0);
    }
}

function clickDecimal (btn) {
    if (isOperationClicked) {
        showOnDisplay('0' + btn.innerText);
        isOperationClicked = false;                
        
    } else if (!display.value.includes('.')) {
        showOnDisplay(btn.innerText, true);
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