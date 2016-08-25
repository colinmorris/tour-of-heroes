import { Pipe, PipeTransform } from '@angular/core';
import { PercentPipe } from '@angular/common';

@Pipe({name: 'multiplier'})
export class MultiplierPipe implements PipeTransform {
    transform(mult: number): string {
        let pct = mult - 1;
        return new PercentPipe().transform(pct, '1.1-1');
    }
}
