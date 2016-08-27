import { mostlyUniformSkillMap, uniformSkillMap, SkillType as ST } from '../skills/index';
import { IStatsService } from '../../stats/stats.service.interface';
import { Klass } from './klass.interface';
import { Stat, NamedUnlock as NU } from '../stats/index';

let low_skill_lvl = 15;
let med_skill_lvl = 30;
let hi_skill_lvl = 75;

let t1_apt = .5;
let t2_apt = .6;
let t3_apt = .7;

// TODO: Specify perks here
export const KLASSES : Klass[] =[
    {
        // perk: double apts until level 10
        name: 'Peasant',
        aptitudes: uniformSkillMap(.5),
        img: 'ruffian.png',
        hint: "??? You shouldn't be reading this...",
        criteria: (s: IStatsService) => true
    },
    {
        name: 'Farmer',
        aptitudes: mostlyUniformSkillMap(t1_apt,
                        {
                            [ST.Farming]: 3.0,
                            [ST.Survival]: .7,
                            [ST.Riding]: 1.0,
                            [ST.Combat]: .3,
                            [ST.Piety]: .7,
                            [ST.Intellect]: .4
                        }),
        img: 'peasant.png',
        hint: `Train your Farming skill`,
        criteria: (s: IStatsService) => {
            return s.checkSkillUnlock(ST.Farming, low_skill_lvl);
        }
    },
    {
        name: 'Woodsman',
        aptitudes: mostlyUniformSkillMap(t1_apt, {
            [ST.Survival]: 2.5,
            [ST.Farming]: 1.0,
            [ST.Stealth]: 1.5,
            [ST.Combat]: .7,
            [ST.Piety]: .6,
            [ST.Charm]: .4,
            [ST.Intellect]: .4

        }),
        img: 'woodsman.png',
        hint: 'Explore the woods',
        criteria: (s: IStatsService) => {
            return s.lifetimeSumActionsTaken('Woody Woods') / 400;
        }
    },
    {
        name: 'Ranger',
        aptitudes: mostlyUniformSkillMap(t2_apt, {
            [ST.Survival]: 3.0,
            [ST.Farming]: .4,
            [ST.Stealth]: 2.0,
            [ST.Piety]: 0.3,
            [ST.Charm]: .6,
            [ST.Intellect]: 1.0,
            [ST.Combat]: 1.0
        }),
        img: 'ranger.png',
        hint: `Become an experienced Woodsman`,
        criteria: (s: IStatsService) => {
            return s.playerLevel('Woodsman') / 20;
        }
    },
    {
        name: 'Archer',
        aptitudes: mostlyUniformSkillMap(t2_apt, {
            [ST.Survival]: 1.0,
            [ST.Farming]: .4,
            [ST.Stealth]: 1.1,
            [ST.Piety]: 0.6,
            [ST.Charm]: 1.2,
            [ST.Intellect]: 1.1,
            [ST.Combat]: 2.5
        }),
        img: 'archer.png',
        hint: `Score lots of crits`,
        criteria: (s: IStatsService) => {
            return s.lifetimeSum(Stat.CriticalActions) / 500;
        }
    },
    {
        name: 'Student',
        aptitudes: mostlyUniformSkillMap(t1_apt, {
            [ST.Intellect]: 2.5,
            [ST.Combat]: .3,
            [ST.Survival]: .3,
            [ST.Charm]: 1.0,
            [ST.Stealth]: 1.0,
            [ST.Riding]: .5,
        }),
        img: 'mage.png',
        hint: `Work hard`,
        criteria: (s: IStatsService) => {
            return s.current(Stat.ActionsTaken) / 1500;
        }
    },
    {
        name: 'Assassin',
        aptitudes: mostlyUniformSkillMap(t2_apt, {
            [ST.Stealth]: 2.5,
            [ST.Intellect]: 1.1,
            [ST.Combat]: 1.5,
            [ST.Piety]: .3
        }),
        img: 'assassin+female.png',
        hint: `Train your Stealth skill`,
        criteria: (s: IStatsService) => {
            return s.checkSkillUnlock(ST.Stealth, med_skill_lvl);
        }
    },
    {
        name: 'Cleric',
        aptitudes: mostlyUniformSkillMap(t2_apt, {
            [ST.Piety]: 2.5,
            [ST.Combat]: 0.1,
            [ST.Survival]: 0.5,
            [ST.Intellect]: 1.3,
            [ST.Stealth]: 1.2
        }),
        img: 'white-mage.png',
        hint: `Live a life free from violence`,
        criteria: (s: IStatsService) => {
            return s.unlocked(NU.Pacifist);
        }
    },
    {
        name: 'Berserker',
        aptitudes: mostlyUniformSkillMap(t1_apt, {
            [ST.Combat]: 2.6,
            [ST.Charm]: .6,
            [ST.Intellect]: .2,
            [ST.Stealth]: .5,
            [ST.Survival]: 1.3
        }),
        img: 'berserker.png',
        hint: `Train your combat skill`,
        criteria: (s: IStatsService) => {
            /** TODO: Maybe criteria should be something like complete X actions
            in Y seconds? **/
            // Let's just use a simple placeholder for now
            return s.checkSkillUnlock(ST.Combat, low_skill_lvl);
        }
    },
    {
        name: 'Skeleton',
        aptitudes: mostlyUniformSkillMap(t1_apt+.5, {
            [ST.Stealth]: .3,
            [ST.Piety]: .3,
            [ST.Charm]: .4,
            [ST.Survival]: 1.8
        }),
        img: 'skeleton.png',
        hint: `Clickety-clack go the spooky Skeleton bones`,
        criteria: (s: IStatsService) => {
            return s.lifetimeSum(Stat.Clicks) / 400;
        }
    },
    {
        name: 'Chocobone', // That name was too good not to steal. Thanks Wesnoth.
        aptitudes: mostlyUniformSkillMap(t3_apt, {
            [ST.Stealth]: 0.1,
            [ST.Riding]: 3.0,
            [ST.Survival]: 1.5,
            [ST.Piety]: 0.3,
            [ST.Combat]: 2.0
        }),
        img: 'chocobone.png',
        /** TODO: Maybe the unlock criteria should be having *reincarnated* as
        each of those classes? As it is, this unlock will always be right on
        the tail of another one. Would be nice to space out those dopamine hits. **/
        hint: 'Discover the Skeleton and Jouster classes',
        criteria: (s: IStatsService) => {
            return s.classUnlocked('Skeleton') && s.classUnlocked('Jouster');
        }
    },
    /** TODO: I like the idea of the jouster having high riding and charm aptitudes, but
    abysmal combat aptitudes because he's never actually seen real battle.
    Passive idea: Brave Sir Robin - gain some stats when retreating from a
    combat encounter (maybe on a cooldown)
    Might be easier to define it as an actual spell, separate from the retreat
    mechanic.
    **/
    {
        name: 'Jouster', // is 'Lancer' a better name?
        aptitudes: mostlyUniformSkillMap(t2_apt, {
            [ST.Stealth]: .5,
            [ST.Riding]: 3.0,
            [ST.Charm]: 2.5,
            [ST.Survival]: .5,
            [ST.Piety]: .8,
            [ST.Combat]: 0.1
        }),
        img: 'lancer.png',
        hint: 'Become a champion jouster',
        criteria: (s: IStatsService) => {
            return s.unlocked(NU.JoustingChampion);
        }
    },
    {
        name: 'Gladiator',
        aptitudes: mostlyUniformSkillMap(t2_apt, {
            [ST.Combat]: 2.0,
            [ST.Charm]: 2.0,
            [ST.Farming]: .6,
            [ST.Piety]: 1.0,
            [ST.Stealth]: .7
        }),
        img: 'pikeman.png',
        hint: `Practice in the Colloseum`,
        criteria: (s: IStatsService) => {
            return s.lifetimeSumActionsTaken('Colloseum') / 50;
        }
    },
    {
        name: 'Scholar',
        aptitudes: mostlyUniformSkillMap(t2_apt, { // copy-paste of student
            [ST.Intellect]: 2.5,
            [ST.Combat]: .3,
            [ST.Survival]: .3,
            [ST.Charm]: 1.0,
            [ST.Stealth]: 1.0,
            [ST.Riding]: .5,
        }),
        img: 'red-mage.png',
        hint: `Get at least a '20' on your report card`,
        criteria: (s: IStatsService) => {
            return s.playerLevel('Student') / 20;
        }
    },
    {
        name: 'Blob',
        aptitudes: mostlyUniformSkillMap(t2_apt, {
            [ST.Riding]: .3,
            [ST.Charm]: .1,
            [ST.Combat]: 1.2,
            [ST.Stealth]: 1.5,
            [ST.Survival]: 1.8
        }),
        img: 'mudcrawler.png',
        hint: 'Take it reeeeeeal slow',
        criteria: (s: IStatsService) => {
            return s.unlocked(NU.SuperSlowAction);
        }
    },
    {
        name: 'Shaman',
        aptitudes: mostlyUniformSkillMap(t2_apt, {
            [ST.Farming]: 1.0,
            [ST.Intellect]: 1.7,
            [ST.Piety]: 1.7,
            [ST.Stealth]: 1.0,
            [ST.Survival]: 1.1,
            [ST.Riding]: .6,
            [ST.Combat]: .7
        }),
        img: 'shaman.png',
        hint: 'Reincarnate many times',
        criteria: (s: IStatsService) => {
            return s.lifetimeSum(Stat.Reincarnations) / 10;
        }
    },
    {
        name: 'Juggler', // TODO: Perk
        aptitudes: mostlyUniformSkillMap(t2_apt, {
            [ST.Farming]: 1.0,
            [ST.Intellect]: 1.5,
            [ST.Piety]: 1.1,
            [ST.Stealth]: 1.4,
            [ST.Survival]: 0.7,
            [ST.Riding]: .8,
            [ST.Combat]: .5,
            [ST.Charm]: 2.5
        }),
        img: 'juggler.png',
        hint: 'Grab three eggs in a row',
        criteria: (s: IStatsService) => {
            return s.unlocked(NU.ThreeEggs);
        }
    },
    {
        name: 'Horseman',
        aptitudes: mostlyUniformSkillMap(t1_apt, {
            [ST.Riding]: 2.5,
            [ST.Combat]: 0.9,
            [ST.Stealth]: 0.4,
            [ST.Survival]: 0.8
        }),
        img: 'horseman.png',
        hint: `Show great stability`,
        criteria: (s: IStatsService) => {
            return s.lifetimeSumActionsTaken('Stables') / 1000;
        }
    }

    // TODO: needs a perk
    // {
    //     name: 'Mage',
    //     aptitudes: mostlyUniformSkillMap(.7, {
    //         [ST.Intellect]: 1.1,
    //         [ST.Combat]: 1.1,
    //     }),
    //     img: 'elder-mage.png',
    //     criteria: (s: IStatsService) => {
    //         let thresh = low_skill_lvl;
    //         return (s.skillLevel(ST.Intellect) > thresh) &&
    //             (s.skillLevel(ST.Combat) > thresh);
    //     }
    // }

]
