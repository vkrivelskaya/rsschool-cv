export const finishModalWindowSelectors = {
    FINISH_WINDOW: '.finish-modal-window',
    FINISH_SCORE: '.finish-score',
    FINISH_WINDOW_CLOSE: '.finish-window-close',

};

export const finishModalWindowClasses = {
    ACTIVE: 'active',
};

const finishModalWindowElement = document.querySelector(finishModalWindowSelectors.FINISH_WINDOW);
const finishModalScoreElement = document.querySelector(finishModalWindowSelectors.FINISH_SCORE);
const finishModalCloseElement = document.querySelector(finishModalWindowSelectors.FINISH_WINDOW_CLOSE);

export class FinishModal {
    openFinishModalWindow() {
        finishModalWindowElement.classList.add(finishModalWindowClasses.ACTIVE);
        finishModalScoreElement.textContent = localStorage.getItem('score');
        finishModalCloseElement.addEventListener('click', this.closeFinishModalWindow.bind(this));
    }

    closeFinishModalWindow() {
        finishModalWindowElement.classList.remove(finishModalWindowClasses.ACTIVE);
    }         
}