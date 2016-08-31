import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { RawPlayer } from '../player/player.interface';
import { StatsData } from '../stats/stats-data.interface';

const player_token = "toh_playerdata";
const stats_token = "toh_statsdata";
const ENCRYPT = false;

interface GameData {
    stats: StatsData;
    player: RawPlayer;
}

function rot1(s: string) : string
 {
    return s.split('').map(function(_)
     {
         let c = _.charCodeAt(0);
         return String.fromCharCode(c+1);
     }).join('');
 }
 function derot1(s: string) : string
  {
     return s.split('').map(function(_)
      {
          let c = _.charCodeAt(0);
          return String.fromCharCode(c-1);
      }).join('');
  }

@Injectable()
export class SerializationService {
    public saveSignaller = new Subject();
    private saveTokens = [player_token, stats_token];

    save() {
        // TODO: This seems silly. Gotta be a better way.
        this.saveSignaller.next(true);
    }

    clearSave() {
        for (let token of this.saveTokens) {
            localStorage.removeItem(token);
        }
    }

    saveStats(stats: StatsData) {
        localStorage.setItem(stats_token, JSON.stringify(stats));
    }
    loadStats() : StatsData {
        console.log("Loading stats");
        let serialized = localStorage.getItem(stats_token);
        return JSON.parse(serialized);
    }

    savePlayer(player: RawPlayer) {
        localStorage.setItem(player_token, JSON.stringify(player));
    }
    loadPlayer() : RawPlayer {
        console.log("Loading player");
        let serialized = localStorage.getItem(player_token);
        return JSON.parse(serialized);
    }

    private loadGameData() : GameData {
        return {
            stats: this.loadStats(),
            player: this.loadPlayer()
        };
    }

    exportToString() : string {
        let gd = this.loadGameData();
        let s = JSON.stringify(gd);
        if (ENCRYPT) {
            s = rot1(s);
        }
        return s;
    }

    loadFromString(enc: string) {
        let decoded = enc;
        if (ENCRYPT) {
            decoded = derot1(enc);
        }
        let gd : GameData = JSON.parse(decoded);
        this.savePlayer(gd.player);
        this.saveStats(gd.stats);
    }
}
