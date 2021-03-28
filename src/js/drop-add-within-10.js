import { Drop } from './drop';

export class DropAddWithin10 extends Drop {
    constructor(...args) {
        super(...args);
        this.operation = '+';
        this.number1 = this.getRandomNumber();
        this.number2 = this.getRandomNumber();
    }

    getMaxNumber() {
        return 10;
    }
}