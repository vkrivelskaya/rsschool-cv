export const startModalWindowSelectors = {
    START_WINDOW: '.start-modal-window',
    CLOSE_BTN: '.start-window-close',
    PLAY_BTN: '.play',
    HOW_T0_PLAY_BTN: '.how-to-play', 
};

export const startModalWindowClasses = {
    ACTIVE: 'active',
};
export class StartModal {
    constructor () {
        this.startModalWindowElement = document.querySelector(startModalWindowSelectors.START_WINDOW);
    }

    openStartModalWindow() {
        this.startModalWindowElement.classList.add(startModalWindowClasses.ACTIVE);
    }

    closeStartModalWindow() {
        this.startModalWindowElement.classList.remove(startModalWindowClasses.ACTIVE);
    }
}