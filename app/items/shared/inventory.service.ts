import { Injectable } from '@angular/core';
import { Item } from './item';
import { Inventory } from './inventory';

@Injectable()
export class InventoryService {
    public inventory: Inventory = new Inventory();
    constructor(

    ) {}

    addItem(item: Item) : boolean {
        return this.inventory.addItem(item);
    }
}
