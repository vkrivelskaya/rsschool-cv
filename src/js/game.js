import { Drop } from './drop';

const maxFailCount = 3;

export class Game {
    constructor() {
        this.speed = 10_000;
        this.drops = [];
        this.failCounter = 0;
    }

    async start() {
        const interval = 5_000;
        for (let i = 0; ; i++) {
            const dropElement = new Drop(this, i);
            this.drops.push(dropElement);
            dropElement.fall();
            await Game.sleep(interval);
            this.speed *= 1 / 1.1;
        }
    }

    notifyDestroyDrop(drop, success) {
        const dropIndex = this.drops.indexOf(drop);
        if (dropIndex > -1) {
            this.drops.splice(dropIndex, 1);
        }
        if (!success) {
            this.failCounter += 1;
            if (this.failCounter === maxFailCount) {
                console.log('3');
            }
        }
    }

    checkResult(result) {
        const drop = this.drops[0];
        drop.destroy(drop.result == result);
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


}

