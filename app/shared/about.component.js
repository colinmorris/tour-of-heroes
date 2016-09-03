"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var AboutComponent = (function () {
    function AboutComponent() {
    }
    AboutComponent = __decorate([
        core_1.Component({
            selector: 'about-tab',
            template: "\n    <div class=\"row\">\n    <div class=\"col-md-8 col-xs-12 col-md-offset-2\">\n    <h1>About</h1>\n\n<p>Tour of Heroes is an incremental game vaguely inspired by the job systems of tactical RPGs like Disgaea: Hour of Darkness, Final Fantasy: Tactics, and Fire Emblem.</p>\n\n<p>The game is implemented in Angular 2 - you can check out the code <a href=\"https://github.com/colinmorris/tour-of-heroes\">here</a>. The title is an homage to the <a href=\"https://angular.io/docs/ts/latest/tutorial/\">Angular 2 Tutorial</a>, which I read a whole lot of while working on this.</p>\n\n<h2>Tips</h2>\n\n<ul>\n    <li>You can speed up your current action by clicking the progress bar.</li>\n    <li>Certain zones have events which can only occur once per lifetime that award a massive number of skill points. Have you slayed the Bat King yet?</li>\n    <li>The \"Heroic Ancestry\" buff is key to progressing to the late game.</li>\n    <li>It generally pays to focus on breadth over depth. Raising two classes to level 50 will give a higher Ancestry bonus than raising one class to level 100.</li>\n    <li>If an action trains more than one skill at once and you're under-leveled for more than one, the slowdown penalty will be compounded.\n        <ul>\n            <li><b>Example:</b> You're level 8 in Piety and Combat. Action A trains Piety and requires level 10 to master. Action B trains Combat and is mastered at level 10. Action C trains Combat and Piety and is mastered when both skills are level 10. A and B will have slowdown penalties of 100%. C will have a slowdown penalty of 300%.</li>\n            <li>However, actions that train multiple skills give more SP than single-skill actions of the same difficulty.</li>\n        </ul>\n    </li>\n    <li>Slowdown can be reduced by increasing your level, even if you don't train any of the skills involved in that zone.</li>\n</ul>\n\n<h2>Acknowledgements</h2>\n\n<p>All unit icons come from the excellent open-source tactical RPG <a href=\"https://www.wesnoth.org/\">Battle for Wesnoth</a>. The skill icons were borrowed from <a href=\"https://crawl.develz.org/\">Dungeon Crawl Stone Soup</a>.</p>\n</div></div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], AboutComponent);
    return AboutComponent;
}());
exports.AboutComponent = AboutComponent;
//# sourceMappingURL=about.component.js.map