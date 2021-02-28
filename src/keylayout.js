export const selectors = {
    INPUT: '.keyboard-input',
    CHAR_KEY: '.char',
    ACTIVATABLE_KEY: '.activatable-key',
    KEYBOARD: '.keyboard',    
};

export const classes = {
    KEYBOARD: 'keyboard',
    ACTIVE: 'active',
    KEYBOARD_KEYS: 'keyboard-keys',
    KEY: 'key',
    WIDE_KEY: 'wide-key',
    ACTIVATABLE_KEY: 'activatable-key',
    EXTRA_WIDE_KEY: 'extra-wide-key',
    DARK_KEY: 'dark-key',
    CHAR_KEY: 'char',
    ACTIVE_KEY: 'active-key',
    KEYBOARD_ACTIVE: 'keyboard active',
};

export const keyboardInputElement = document.querySelector(selectors.INPUT);

const defaultHandler = (e) => {
    keyboardInputElement.value += e.target.innerHTML;
};

export let isCapsLock = false;

export const keyLayout = [
    {label: '1', handler: defaultHandler},
    {label: '2', handler: defaultHandler},
    {label: '3', handler: defaultHandler},
    {label: '4', handler: defaultHandler},
    {label: '5', handler: defaultHandler},
    {label: '6', handler: defaultHandler},
    {label: '7', handler: defaultHandler},
    {label: '8', handler: defaultHandler},
    {label: '9', handler: defaultHandler},
    {label: '0', handler: defaultHandler},
    {
        label: 'backspace',
        isLineBreakAfterKey: true,
        icon: 'backspace',
        className: [classes.WIDE_KEY],
        handler: () => {
            keyboardInputElement.value = keyboardInputElement.value.slice(0,keyboardInputElement.value.length - 1);
        },
    },
    {label: 'q', isChar: true, handler: defaultHandler},
    {label: 'w', isChar: true, handler: defaultHandler},
    {label: 'e', isChar: true, handler: defaultHandler},
    {label: 'r', isChar: true, handler: defaultHandler},
    {label: 't', isChar: true, handler: defaultHandler},
    {label: 'y', isChar: true, handler: defaultHandler},
    {label: 'u', isChar: true, handler: defaultHandler},
    {label: 'i', isChar: true, handler: defaultHandler},
    {label: 'o', isChar: true, handler: defaultHandler},
    {label: 'p', isChar: true, isLineBreakAfterKey: true, handler: defaultHandler},
    {
        label: 'keyboard_capslock', 
        icon: 'keyboard_capslock', 
        className: [classes.WIDE_KEY, classes.ACTIVATABLE_KEY],
        handler: () => {
            const buttons = document.querySelectorAll(selectors.CHAR_KEY);
            const capsButton = document.querySelector(selectors.ACTIVATABLE_KEY);
            
            isCapsLock = !isCapsLock;
            buttons.forEach(el => {
                el.textContent = isCapsLock ? el.textContent.toUpperCase() : el.textContent.toLowerCase();
            });
            capsButton.classList.toggle(classes.ACTIVE_KEY);
        },
    },
    {label: 'a', isChar: true, handler: defaultHandler},
    {label: 's', isChar: true, handler: defaultHandler},
    {label: 'd', isChar: true, handler: defaultHandler},
    {label: 'f', isChar: true, handler: defaultHandler},
    {label: 'g', isChar: true, handler: defaultHandler},
    {label: 'h', isChar: true, handler: defaultHandler},
    {label: 'j', isChar: true, handler: defaultHandler},
    {label: 'k', isChar: true, handler: defaultHandler},
    {label: 'l', isChar: true, handler: defaultHandler},
    {
        label: 'keyboard_return', 
        isLineBreakAfterKey: true, 
        icon: 'keyboard_return', 
        className: [classes.WIDE_KEY],
        handler: () => {
            keyboardInputElement.value += '\n';
        },
    },
    {
        label: 'check_circle', 
        icon: 'check_circle', 
        className: [classes.WIDE_KEY, classes.DARK_KEY],
        handler: () => {
            document.querySelector(selectors.KEYBOARD).classList.remove(classes.ACTIVE);
        },
    },
    {label: 'z', isChar: true, handler: defaultHandler},
    {label: 'x', isChar: true, handler: defaultHandler},
    {label: 'c', isChar: true, handler: defaultHandler},
    {label: 'v', isChar: true, handler: defaultHandler},
    {label: 'b', isChar: true, handler: defaultHandler},
    {label: 'n', isChar: true, handler: defaultHandler},
    {label: 'm', isChar: true, handler: defaultHandler},
    {label: ',', handler: defaultHandler},
    {label: '.', handler: defaultHandler},
    {label: '?', isLineBreakAfterKey: true, handler: defaultHandler},
    {
        label: 'space_bar', 
        icon: 'space_bar', 
        className: [classes.EXTRA_WIDE_KEY],
        handler: () => {
            keyboardInputElement.value += ' ';
        },
    },
];