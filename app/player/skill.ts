import { GLOBALS } from '../globals';

interface Bonus {
    amt: number;
    name: string;
}

export class Skill {
    aptitudeBonuses: Bonus[] = [];
    levelBonuses: Bonus[] = [];
    constructor(
        public id: number,
        public name: string,
        // starting from 0
        public level: number,
        public aptitude: number,
        public skillPoints: number
    ){}

    get effectiveAptitude() {
        return this.aptitude + this.bonusAptitude;
    }
    get bonusAptitude() {
        return this.aptitudeBonuses.reduce(
            (prev: number, curr: Bonus) => {
                return prev+curr.amt;
            },
            0);
    }
    // TODO
    get effectiveSkill(){
        return 0;
    }
    get bonusSkill(){
        return 0;
    }

    addBonus(to: string, name: string, amt: number) {
        console.log(`Applying ${name} buff`);
        let destArray = to == "level" ? this.levelBonuses : this.aptitudeBonuses;
        destArray.push( {amt: amt, name: name} );
    }

    removeBonus(which: string, name: string) {
        console.log(`Removing ${name} buff`);
        let destArray = which == "level" ? this.levelBonuses : this.aptitudeBonuses;
        let match = destArray.findIndex( (element) => { return element.name == name; });
        if (match != -1) {
            destArray.splice(match, 1);
        } else {
            console.warn(`Couldn't find bonus with name ${name}`);
        }
    }

    // Returns number of SP increased by
    train(points: number) : number {
        // FIXME: It's too easy to make the mistake of multiplying by aptitude
        // instead of effectiveAptitude. Should switch the name.
        let pointGain = points * this.effectiveAptitude;
        let newTotal = this.skillPoints + pointGain;
        let thresh = this.pointsForNextLevel();
        let delta = 0;
        while (newTotal >= thresh) {
            this.level++;
            delta++;
            newTotal -= thresh;
            thresh = this.pointsForNextLevel();
        }
        this.skillPoints = newTotal;
        return pointGain;
    }

    pointsForNextLevel() : number {
        return Skill.pointsForNextLevel(this.level);
    }

    static pointsForNextLevel(level: number) : number {
        // 100, 200, 400, etc. probably too steep
        return GLOBALS.skillLevelBaseCost * Math.pow(2, level);
    }

    percentProgress() : number {
        return 100 * (this.skillPoints / this.pointsForNextLevel());
    }

}
