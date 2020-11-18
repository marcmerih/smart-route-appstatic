import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  tripSetupForm: FormGroup;
  intermediateLocationForm: FormGroup;
  public nodes$: EventEmitter<string>;

  constructor() {
    this.nodes$ = new EventEmitter();
    this.tripSetupForm = new FormGroup({
      startingLocation: new FormControl(''),
      endingLocation: new FormControl('')
    });

    this.intermediateLocationForm = new FormGroup({
      address: new FormControl('')
    })
  }

  setListOfNodes(nodes) {
    this.nodes$.emit(nodes);
  }
}
