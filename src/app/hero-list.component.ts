import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

import { Hero }        from './data-model';
import { HeroService } from './hero.service';


@Component({
  selector: 'hero-list',
  template: `
  <h3 *ngIf="isLoading"><i>Loading heroes ... </i></h3>
  <h3 *ngIf="!isLoading">Select a hero:</h3>
  
  <nav>
    <button (click)="getHeroes()" class="btn btn-primary">Refresh</button>
    <a *ngFor="let hero of heroes | async" (click)="select(hero)">{{hero.name}}</a>
  </nav>
  
  <div *ngIf="selectedHero">
    <hr>
    <h2>Hero Detail</h2>
    <h3>Editing: {{selectedHero.name}}</h3>
    <hero-detail [hero]="selectedHero"></hero-detail>
  </div>
  `,
  styles: []
})
export class HeroListComponent implements OnInit {
  heroes: Observable<Hero[]>;
  isLoading = false;
  selectedHero: Hero;

  constructor(private heroService: HeroService) { }

  ngOnInit() { this.getHeroes(); }

  getHeroes() {
    this.isLoading = true;
    this.heroes = this.heroService.getHeroes()
                      // Todo: error handling
                      .finally(() => this.isLoading = false);
    this.selectedHero = undefined;
  }

  select(hero: Hero) { this.selectedHero = hero; }
}
