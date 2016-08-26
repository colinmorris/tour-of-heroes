import { Pipe, PipeTransform } from '@angular/core';
import { PercentPipe } from '@angular/common';

@Pipe({name: 'multiplier'})
export class MultiplierPipe implements PipeTransform {
    transform(mult: number): string {
        // TODO: This pipe is now pointless
        let pct = mult;
        return new PercentPipe().transform(pct, '1.1-1');
    }
}
