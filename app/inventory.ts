import { GLOBALS } from './globals';
import { Item } from './item';

export class Inventory {
    capacity: number = GLOBALS.inventoryCapacity;
    items: Item[] = [];

    constructor() {
        this.items = new Array<Item>(this.capacity);
    }

    get size() : number {
        return this.items.reduce(
            (prev, curr) => {
                return prev + (curr ? 1 : 0);
            }, 0);
                
    }

    get indices() : number[] {
        // zzz this shouldn't be so hard
        let idxs = new Array<number>(this.capacity);
        return idxs.map( (val, idx) => { return idx; });
    }

    addItem(item: Item) : boolean {
        for (let idx of this.indices) {
            if (!this.items[idx]) {
                this.items[idx] = item;
                return true;
            }
        }
        return false;
    }

    removeItem(idx: number) {
        this.items[idx] = undefined;   
    }
}

