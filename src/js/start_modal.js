import { startModalWindowSelectors } from './constants/selectors';
import { startModalWindowClasses } from './constants/classes';

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