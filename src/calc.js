const selectors = {
    CALCULATOR: '.calculator',
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

const displayElement = document.querySelector(selectors.DISPLAY);
const displayLength = 13;
let isOperationClicked = false;
let operationResult = 0;
let operation = '';

function showOnDisplay(output, isAddition=false) {
    if (isAddition) {
        if (displayElement.value.length === displayLength){
            return;
        }
        displayElement.value += output;
    } else {
        displayElement.value = output.toString().substring(0, displayLength);
    }
}

function onNumberClick({innerText}) { 
    if (isOperationClicked) { 
        showOnDisplay(innerText);        
        isOperationClicked = false;  
    } else {        
        showOnDisplay(innerText, displayElement.value !== '0');            
    }
}

function onOperationClick({outerText}) {
    if (isOperationClicked) {
        operation = outerText;
        return;
    }
    const numberOnDisplay = displayElement.value;
    
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
                operation = outerText;                 
        }

    if (outerText === '=') {
        showOnDisplay(operationResult);
        operation = ''; 
    } else {
        operation = outerText;
    }
    isOperationClicked = true;
}

function onCleanClick(btn) {
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

function onDecimalClick ({innerText}) {
    if (isOperationClicked) {
        showOnDisplay('0' + innerText);
        isOperationClicked = false;                
        
    } else if (!displayElement.value.includes('.')) {
        showOnDisplay(innerText, true);
        isOperationClicked = false;
    } 
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