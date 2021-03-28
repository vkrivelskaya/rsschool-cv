import { Drop } from './drop';

export class DropAddWithin10 extends Drop {
    constructor(...args) {
        super(...args);
        this.maxNumber = 10;
        this.operation = '+';
        this.number1 = this.getRandomNumber();
        this.number2 = this.getRandomNumber();
    }
}