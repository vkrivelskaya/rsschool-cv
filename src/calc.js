const selectors = {
    CALCULATOR: '.calculator',
    DISPLAY: '.display'
};

const classes = {
    CLEAN: 'clean',
    DECIMAL: 'decimal',
    NUMBER: 'number',
    OPERATION: 'operation',
    CE: 'CE btn',
    C: 'C btn',    
};

const displayElement = document.querySelector(selectors.DISPLAY);
let isOperationClicked = false;
let operationResult = 0;
let operation = '';

function showOnDisplay(output, isAddition = false) {
    const displayLength = 11;
    const valueToStore = isAddition ? displayElement.value + output : output;

    displayElement.value = valueToStore.toString().substring(0, displayLength);
}

function onNumberClick({innerText}) { 
    if (isOperationClicked) { 
        showOnDisplay(innerText);        
        isOperationClicked = false;  
    } else {        
        showOnDisplay(innerText, displayElement.value !== '0');            
    }
}

function getOperationResultOnOperationClick () {
    const numberOnDisplay = displayElement.value;
    
    switch (operation) {
        case '+':                
            return operationResult + parseFloat(numberOnDisplay);
        case '-':                
            return operationResult - parseFloat(numberOnDisplay);
        case '*':                
            return operationResult * parseFloat(numberOnDisplay);
        case '/':               
            return operationResult / parseFloat(numberOnDisplay);
        default:
            return parseFloat(numberOnDisplay);  
    }
}

function onOperationClick({outerText}) {
    if (isOperationClicked) {
        operation = outerText;
        if (operation === '=') {
            showOnDisplay(operationResult);
        }
        return;
    }

    operationResult = getOperationResultOnOperationClick();
    showOnDisplay(operationResult);
    operation = outerText === '=' ? '' : outerText;
    isOperationClicked = true;
}

function onCleanClick(btn) {
    const isCEButton = btn.className.includes(classes.CE);
    const isCButton = btn.className.includes(classes.C);     
    
    if (isCButton) {
        operationResult = 0;
        operation = '';        
    }

    console.log (operationResult);

    showOnDisplay(0);
    isOperationClicked = isCEButton;
}

function onDecimalClick ({ innerText }) {
    if (isOperationClicked) {
        showOnDisplay('0' + innerText); 
    } 

    if (!displayElement.value.includes('.')) {
        showOnDisplay(innerText, true);
    } 

    isOperationClicked = false; 
} 

function init() {
    const calculatorElement = document.querySelector(selectors.CALCULATOR);
         
    calculatorElement.addEventListener('click', (e) => {
        const target = e.target;

        if (target.className.includes(classes.NUMBER)) {
            onNumberClick(target);                            
        } else if (target.className.includes(classes.OPERATION)) {
            onOperationClick(target);                   
        } else if (target.className.includes(classes.CLEAN)) {
            onCleanClick(target);   
        } else if (target.className.includes(classes.DECIMAL)) {
            onDecimalClick(target);                   
        }
    });
}

init();