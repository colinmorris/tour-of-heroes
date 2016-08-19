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
        <img src="{{imgPath}}">
    `
})
export class SkillComponent {
    @Input() skill: SkillType;
    get imgPath() {
        return skill_images[this.skill];
    }
}
