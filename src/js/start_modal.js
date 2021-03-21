export const startModalWindowSelectors = {
    START_WINDOW: '.start-modal-window',
    CLOSE_BTN: '.start-window-close',
    PLAY_BTN: '.play',
    HOW_T0_PLAY_BTN: '.how-to-play',
};

export const startModalWindowClasses = {
    ACTIVE: 'active',
};

const startModalWindowElement = document.querySelector(startModalWindowSelectors.START_WINDOW);

export class StartModal {
    constructor () {

    }

    openStartModalWindow() {
        startModalWindowElement.classList.add(startModalWindowClasses.ACTIVE);
    }

    closeStartModalWindow() {
        startModalWindowElement.classList.remove(startModalWindowClasses.ACTIVE);
    }
}