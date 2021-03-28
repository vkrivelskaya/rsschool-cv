import { Drop } from './drop';

export class DropDivision2 extends Drop {
    constructor(...args) {
        super(...args);
        this.number2 = 2;
        this.operation = '/';
    }
}