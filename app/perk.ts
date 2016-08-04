
// This is gonna be a bitch to implement.
//
// Need to think of what categories these might fall under:
// - flat bonuses to skill/aptitude levels
// - bonuses to action speed (possibly allowing going under the 'minimum' per zone?)
// - affect chances of 'bonus zones' appearing
// - augmenting the outcome of an action when it's completed
// - inserting a new (otherwise impossible) action at action-selection time
// - random shuffling of aptitudes (that one's pretty unique)
//
// All of the above may be conditioned on criteria such as:
// - being in a particular zone (or type of zone)
// - random chance
// - having been active/inactive for some amount of time
// - day of week?
// - timer (e.g. maybe provides benefit X every 5 minutes)
// - user initiation (do we want to include 'active skills' under this perk umbrella?)
//
// Also, another type would be the providing of temporary (prob random) buffs,
// which could have the effect of any of the benefits in the first list.
//
// Maybe perks should be grouped according to where/when they're active, and
// for each group, we set up a listener for changes (e.g. zone changes) at 
// which point we check whether the perk should fire
//
// Maybe a guideline should be that class perks should be the 'crazy' ones
// with weird/game-changing/buildaround effects, and skill perks should tend to
// be more boring (e.g. static bonuses to skill/aptitude)

import { Player } from './player';
import { PlayerService } from './player.service';


export interface Perk {
    name: string;
    setup(ps: PlayerService);
    teardown();
}

abstract class LevelPerk implements Perk {
    name: string;
    subscription;
    setup(ps: PlayerService) {
        this.subscription = ps.levelSubject.subscribe(
            (next) => {
                this.levelChange(next, ps.player);
            });
    }
    teardown() {
        this.subscription.unsubscribe();
    }

    abstract levelChange(next: number, player: Player);
}

class PeasantPerk extends LevelPerk {
    active : boolean = false;
    name = "peasant";
    levelChange(level: number, player: Player) {
        console.log(`Observed level go to ${level}`);
        if (!this.active && level < 5) {
            this.activate(player);
        } else if (this.active && level >= 5) {
            this.deactivate(player);
        }
    }

    activate(player: Player) {
        this.active = true;
        for (let skill of player.character.skills) {
            // TODO: this is assuming that...
            // a) this perk should only double 'base' aptitude (not buffed)
            // b) base aptitude can't change within a lifetime
            skill.addBonus("aptitude", this.name, skill.aptitude);
        }
    }

    deactivate(player: Player) {
        for (let skill of player.character.skills) {
            skill.removeBonus("aptitude", this.name);
        }
    }

}

export const CLASS_PERKS = {
    'Peasant': PeasantPerk,
};
