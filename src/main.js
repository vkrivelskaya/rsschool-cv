const selectors = {
    PANELS: '.panels',    
};

const classes = {
    OPEN: 'open',
    OPEN_ACTIVE: 'open-active',
    PANEL: 'panel',
};

function toggleOpenClass(e) {    
    if (e.target.className.includes(classes.PANEL)) {
        e.target.classList.toggle(classes.OPEN);
    } else {
        e.target.parentElement.classList.toggle(classes.OPEN);
    }    
}

function toggleActiveClass(e) {
    if (e.propertyName.includes('flex')) {
        e.target.classList.toggle(classes.OPEN_ACTIVE);
    }       
}

function init() {
    const panelsContainerElement = document.querySelector(selectors.PANELS);
   
    panelsContainerElement.addEventListener('click', toggleOpenClass);
    panelsContainerElement.addEventListener('transitionend', toggleActiveClass);
}

init();