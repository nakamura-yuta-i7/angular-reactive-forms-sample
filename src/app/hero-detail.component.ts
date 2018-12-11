import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { states, Address, Hero } from './data-model';
import { HeroService } from './hero.service';


@Component({
  selector: 'hero-detail',
  templateUrl: "./hero-detail.html",
  styles: []
})
export class HeroDetailComponent implements OnChanges {
  heroForm: FormGroup;
  states = states;
  
  @Input() hero: Hero;
  
  constructor(
    private fb: FormBuilder,
    private heroService: HeroService) {
  
    this.createForm();
    this.logNameChange();
  }
  
  
  createForm() {
    this.heroForm = this.fb.group({
      name: ['', Validators.required ],
      secretLairs: this.fb.array([]), // <-- secretLairs as an empty FormArray
      power: '',
      sidekick: ''
    });
  }
  setAddresses(addresses: Address[]) {
    const addressFGs = addresses.map(address => this.fb.group(address));
    const addressFormArray = this.fb.array(addressFGs);
    this.heroForm.setControl('secretLairs', addressFormArray);
  }
  ngOnChanges() {
    this.rebuildForm();
  }
  rebuildForm() {
    this.heroForm.reset({
      name: this.hero.name
    });
    this.setAddresses(this.hero.addresses);
  }
  revert() { this.rebuildForm(); }
  
  get secretLairs(): FormArray {
    return this.heroForm.get('secretLairs') as FormArray;
  };
  addLair() {
    this.secretLairs.push(this.fb.group(new Address()));
  }
  
  nameChangeLog: string[] = [];
  logNameChange() {
    const nameControl = this.heroForm.get('name');
    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
  }
  
  onSubmit() {
    this.hero = this.prepareSaveHero();
    this.heroService.updateHero(this.hero).subscribe(/* error handling */);
    this.rebuildForm();
  }
  prepareSaveHero(): Hero {
    const formModel = this.heroForm.value;
    // deep copy of form model lairs
    const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
      (address: Address) => Object.assign({}, address)
    );
  
    // return new `Hero` object containing a combination of original hero value(s)
    // and deep copies of changed form model values
    const saveHero: Hero = {
      id: this.hero.id,
      name: formModel.name as string,
      // addresses: formModel.secretLairs // <-- bad!
      addresses: secretLairsDeepCopy
    };
    return saveHero;
  }
}
