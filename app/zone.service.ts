import { Injectable } from '@angular/core';
import { Zone } from './zone';
import { SkillType } from './skill';

@Injectable()
export class ZoneService {

    // TODO: method to return all game zones
    
    skillProbs(zone: Zone) : number[] {
        let probs = new Array<number>(SkillType.MAX);
        let totalWeight = 0.0;
        for (let skill=0; skill<SkillType.MAX; skill++) {
            totalWeight += zone.skillTrainingWeights[skill];
        }
        for (let skill=0; skill<SkillType.MAX; skill++) {
            probs[skill] = zone.skillTrainingWeights[skill] / totalWeight;
        }
        return probs;
    }

    chooseSkillUp(zone: Zone): [number, number] {
        let probs = this.skillProbs(zone);
        let rand = Math.random();
        let weightSeen = 0.0;
        let chosenSkill : number;
        for (let skill=0; skill<SkillType.MAX; skill++) {
            weightSeen += probs[skill];
            if (weightSeen > rand) {
                chosenSkill = skill;
                break;
            }
        }
        // The points awarded to zone skill are equal to its value weighted by
        // its inverse probability. E.g. if our values are {A: .2, B: 1.8}, then
        // each skill gets 2 points when selected. The net effect is that .2/1.8 are
        // the expected gain for each skill per action.
        // TODO: This code is actually more involved than it needs to be, since the
        // points are gonna be the same for every skill every time. sort of didn't 
        // realize that until now
        return [chosenSkill, zone.skillTrainingWeights[chosenSkill]/probs[chosenSkill]];
    }
}

