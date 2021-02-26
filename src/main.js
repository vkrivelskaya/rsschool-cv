const selectors = {
    INPUT: '.keyboard-input',
    CHAR_KEY: '.char',
    ACTIVATABLE_KEY: '.activatable-key',
};

const classes = {
    KEYBOARD: 'keyboard',
    HIDDEN: 'hidden',
    KEYBOARD_KEYS: 'keyboard-keys',
    KEY: 'key',
    WIDE_KEY: 'wide-key',
    ACTIVATABLE_KEY: 'activatable-key',
    EXTRA_WIDE_KEY: 'extra-wide-key',
    DARK_KEY: 'dark-key',
    CHAR_KEY: 'char',
    ACTIVE_KEY: 'active-key',
};

const keyboardInputElement = document.querySelector(selectors.INPUT);
let capsLock = false;

const keysHandlers = {
    backspace: () => {
        keyboardInputElement.value = keyboardInputElement.value.slice(0,keyboardInputElement.value.length - 1);
    },
    keyboard_return: () => {
        keyboardInputElement.value += '\n';
    },
    check_circle: () => {
        keyboardElement.classList.add(classes.HIDDEN);
    },
    space_bar: () => {
        keyboardInputElement.value += ' ';
    },
    keyboard_capslock: () => {
        const buttons = document.querySelectorAll(selectors.CHAR_KEY);
        const capsButton = document.querySelector(selectors.ACTIVATABLE_KEY);
        
        capsLock = !capsLock;
        buttons.forEach(el => {
            el.textContent = capsLock ? el.textContent.toUpperCase() : el.textContent.toLowerCase();
        });
        capsButton.classList.toggle(classes.ACTIVE_KEY);
    },

    default: (e) => {
        keyboardInputElement.value += e.target.innerHTML;
    }

};

let keyboardElement;
let keyContainerElement;

const createIconHTML = (icon_name) => {
    return `<span class='material-icons'>${icon_name}</span>`;
};

function determineKeyValue(e) {    
    let keyHandler = keysHandlers[e.target.innerText];

    if (keyHandler === undefined) {
        keyHandler = keysHandlers.default;
    }
    
    if (e.target.parentNode.className !== classes.KEYBOARD) {
        keyHandler(e);        
    }
}
 
function listenKeyboardClick() {
    keyboardElement.addEventListener('click', determineKeyValue);
}

function createKeys() {
    const fragment = document.createDocumentFragment();
    const chars = [
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
        'z', 'x', 'c', 'v', 'b', 'n', 'm'
    ];
    const keyLayout = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
        'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
        'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?',
        'space'
    ];
    
    keyLayout.forEach(key => {
        const keyElement = document.createElement('button');
        const insertLineBreak = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;

        keyElement.setAttribute('type', 'button');
        keyElement.classList.add(classes.KEY); 

        if (chars.indexOf(key) !== -1) {
            keyElement.classList.add(classes.CHAR_KEY);
        }

        switch (key) {
            case 'backspace':
                keyElement.classList.add(classes.WIDE_KEY);
                keyElement.innerHTML = createIconHTML('backspace');
            break;

            case 'caps':
                keyElement.classList.add(classes.WIDE_KEY, classes.ACTIVATABLE_KEY);
                keyElement.innerHTML = createIconHTML('keyboard_capslock'); 
            break;

            case 'enter':
                keyElement.classList.add(classes.WIDE_KEY);
                keyElement.innerHTML = createIconHTML('keyboard_return');
            break;

            case 'space':
                keyElement.classList.add(classes.EXTRA_WIDE_KEY);
                keyElement.innerHTML = createIconHTML('space_bar');
            break;

            case 'done':
                keyElement.classList.add(classes.WIDE_KEY, classes.DARK_KEY );
                keyElement.innerHTML = createIconHTML('check_circle');
            break;

            default:
                keyElement.textContent = capsLock ? key.toUpperCase() : key.toLowerCase();
            break;
        }
        fragment.appendChild(keyElement);

        if (insertLineBreak) {
            fragment.appendChild(document.createElement('br'));
        }
    });
    keyContainerElement.appendChild(fragment);
}

function createKeyboard() {
    keyboardElement = document.createElement('div');
    keyContainerElement = document.createElement('div');

    document.body.appendChild(keyboardElement);
    keyboardElement.appendChild(keyContainerElement);
    keyboardElement.classList.add(classes.KEYBOARD, classes.HIDDEN);
    keyContainerElement.classList.add(classes.KEYBOARD_KEYS);
    createKeys();
    listenKeyboardClick();
}

function showKeyboard() {
    keyboardElement.classList.remove(classes.HIDDEN);
}

function init() {
    document.addEventListener('DOMContentLoaded', createKeyboard);
    keyboardInputElement.addEventListener('click', showKeyboard);    
}

init();