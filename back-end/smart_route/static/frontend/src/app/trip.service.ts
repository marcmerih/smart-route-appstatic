import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  tripSetupForm: FormGroup;
  intermediateLocationForm: FormGroup;

  constructor() {
    this.tripSetupForm = new FormGroup({
      startingLocation: new FormControl(''),
      endingLocation: new FormControl('')
    });

    this.intermediateLocationForm = new FormGroup({
      address: new FormControl('')
    })
  }
}
