import { finishModalWindowSelectors } from './constants/selectors';
import { finishModalWindowClasses } from './constants/classes';

export class FinishModal {
    constructor() {
        this.finishModalWindowElement = document.querySelector(finishModalWindowSelectors.FINISH_WINDOW);
        this.finishModalScoreElement = document.querySelector(finishModalWindowSelectors.FINISH_SCORE);
        this.finishModalCloseElement = document.querySelector(finishModalWindowSelectors.FINISH_WINDOW_CLOSE); 
    }

    openFinishModalWindow() {
        this.finishModalWindowElement.classList.add(finishModalWindowClasses.ACTIVE);
        this.finishModalScoreElement.textContent = localStorage.getItem('score');
        this.finishModalCloseElement.addEventListener('click', this.closeFinishModalWindow.bind(this));
    }

    closeFinishModalWindow() {
        this.finishModalWindowElement.classList.remove(finishModalWindowClasses.ACTIVE);
    }         
}