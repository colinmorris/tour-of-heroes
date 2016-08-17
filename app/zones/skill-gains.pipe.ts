import { Pipe, PipeTransform } from '@angular/core';

import { SkillMap, SkillType, getTruthySkills } from '../core/index';

@Pipe({name: 'skillgains'})
export class SkillGainsPipe implements PipeTransform {
    transform(gains: SkillMap): string {
        let gainstr = '';
        for (let skill of getTruthySkills(gains)) {
            if (gainstr != '') {
                gainstr += ', ';
            }
            let skillName: string = SkillType[skill];
            gainstr += `${skillName}+${gains[skill]}`;
        }
        return gainstr;
    }
}
