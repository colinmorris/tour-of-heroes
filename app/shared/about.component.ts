import { Component } from '@angular/core';

@Component({
    selector: 'about-tab',
    template: `
    <div class="row">
    <div class="col-md-8 col-xs-12 col-md-offset-2">
    <h1>About</h1>

<p>Tour of Heroes is an incremental game vaguely inspired by the job systems of tactical RPGs like Disgaea: Hour of Darkness, Final Fantasy: Tactics, and Fire Emblem.</p>

<p>The game is implemented in Angular 2 - you can check out the code <a href="https://github.com/colinmorris/tour-of-heroes">here</a>. The title is an homage to the <a href="https://angular.io/docs/ts/latest/tutorial/">Angular 2 Tutorial</a>, which I read a whole lot of while working on this.</p>

<h2>Tips</h2>

<ul>
    <li>Certain zones have events which can only occur once per lifetime that award a massive number of skill points. Have you slayed the Bat King yet?</li>
    <li>The "Heroic Ancestry" buff is key to progressing to the late game.</li>
    <li>It generally pays to focus on breadth over depth. Raising two classes to level 50 will give a higher Ancestry bonus than raising one class to level 100.</li>
    <li>If an action trains more than one skill at once and you're under-leveled for more than one, the slowdown penalty will be compounded.
        <ul>
            <li><b>Example:</b> You're level 8 in Piety and Combat. Action A trains Piety and requires level 10 to master. Action B trains Combat and is mastered at level 10. Action C trains Combat and Piety and is mastered when both skills are level 10. A and B will have slowdown penalties of 100%. C will have a slowdown penalty of 300%.</li>
            <li>However, actions that train multiple skills give more SP than single-skill actions of the same difficulty.</li>
        </ul>
    </li>
</ul>

<h2>Acknowledgements</h2>

<p>All unit icons come from the excellent open-source tactical RPG <a href="https://www.wesnoth.org/">Battle for Wesnoth</a>. The skill icons were borrowed from <a href="https://crawl.develz.org/">Dungeon Crawl Stone Soup</a>.</p>
</div></div>
    `
})
export class AboutComponent {

}
