import {
    keyLayout, 
    isCapsLock, 
    keyboardInputElement,
    classes
} from './keylayout.js';

let keyboardElement;
let keyContainerElement;

const createIconHTML = (iconName) => {
    return `<span class='material-icons'>${iconName}</span>`;
};

function determineKeyValue(e) {
    if (e.target.parentNode.className !== classes.KEYBOARD_ACTIVE) {
        const key = keyLayout.find(item => item.label === e.target.innerText.toLowerCase());
        key.handler(e);      
    }
}
 
function listenKeyboardClick() {
    keyboardElement.addEventListener('click', determineKeyValue);
}

function createKeys() {
    const fragment = document.createDocumentFragment();    
    
    keyLayout.forEach(key => {
        const keyElement = document.createElement('button');

        keyElement.setAttribute('type', 'button');
        keyElement.classList.add(classes.KEY); 

        if (key.isChar) {
            keyElement.classList.add(classes.CHAR_KEY);
        }

        if (key.icon && key.className) {
            keyElement.classList.add(...key.className);
            keyElement.innerHTML = createIconHTML(key.icon);
        } else {
            keyElement.textContent = isCapsLock ? key.label.toUpperCase() : key.label.toLowerCase();
        }
        
        fragment.appendChild(keyElement);

        if (key.isLineBreakAfterKey) {
            fragment.appendChild(document.createElement('br'));
        }
    });
    keyContainerElement.appendChild(fragment);
}

function createKeyboardElement() {
    keyboardElement = document.createElement('div');
    keyContainerElement = document.createElement('div');

    document.body.appendChild(keyboardElement);
    keyboardElement.appendChild(keyContainerElement);
    keyboardElement.classList.add(classes.KEYBOARD);
    keyContainerElement.classList.add(classes.KEYBOARD_KEYS);
}

function createKeyboard() {
    createKeyboardElement();
    createKeys();
    listenKeyboardClick();
}

function showKeyboard() {
    keyboardElement.classList.add(classes.ACTIVE);
}

function init() {
    document.addEventListener('DOMContentLoaded', createKeyboard);
    keyboardInputElement.addEventListener('click', showKeyboard);    
}

init();