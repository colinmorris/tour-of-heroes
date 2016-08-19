import { Component, Input } from '@angular/core';

import { SkillType, skill_images } from '../core/index';

@Component({
    selector: 'skill',
    styles: [
        `img {
            background-color: darkgray;
        }`
    ],
    template: `
        <img [style.background-color]="bg" src="{{imgPath}}">
    `
})
export class SkillComponent {
    @Input() skill: SkillType;
    @Input() bg: any;
    get imgPath() {
        return skill_images[this.skill];
    }
    ngOnInit() {
        if (!this.bg) {
            this.bg = "darkgray";
        }
    }
}
