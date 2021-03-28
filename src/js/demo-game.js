import { Calc } from './calc';
import { Game } from './game';

export class DemoGame extends Game {  
    constructor(gameMode) {
        super(gameMode);
    }  
    createDrop(dropIndex) {    
        const calcButtons = Calc.getButtons();
        const drop = super.createDrop(dropIndex);
        const demoResult = dropIndex !== 4 ? drop.result : Math.round(Math.random() * (drop.result - 1));
        
        setTimeout(() => {
            String(demoResult).split('').forEach((el) => {
                calcButtons[el].dispatchEvent(new Event('click', {bubbles: true}));
            });
        }, 2000);
        setTimeout(() => {            
            calcButtons['Enter'].dispatchEvent(new Event('click', {bubbles: true})); 
        }, 2500);        
    }
}