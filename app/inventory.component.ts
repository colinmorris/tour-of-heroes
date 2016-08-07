import { Component } from '@angular/core';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory';

@Component({
    selector: 'inventory',
    template: `
    <h3>Inventory ({{inventory.size}}/{{inventory.capacity}})</h3>
    <ul>
        <li *ngFor="let idx of inventory.indices">
            <a *ngIf="inventory.items[idx]" (click)="useItem(i)">{{inventory.items[idx].name}}</a>
        </li>
    </ul>
    `
})
export class InventoryComponent {

    constructor(private IS: InventoryService)
    {
    }

    get inventory() : Inventory {
        return this.IS.inventory;
    }

    useItem(idx: number) {
      // TODO: implement this
      console.log(`pretending to use ${this.inventory[idx].name}. Don't forget to implement this...`);
       //this.inventory.items[idx].applyItem(this.game);
       this.inventory.removeItem(idx);
    }
}
