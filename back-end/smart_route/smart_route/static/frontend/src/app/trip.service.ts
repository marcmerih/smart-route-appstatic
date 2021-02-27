import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouteModel, RouteObject } from './models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  tripSetupForm: FormGroup;
  intermediateLocationForm: FormGroup;
  preferencesForm: FormGroup;
  currentRoute: RouteObject;
  public nodes$: EventEmitter<string>;
  public poiMarkers$: EventEmitter<string>;
  public resetMarkers$: EventEmitter<string>;

  constructor(private http: HttpClient, private router: Router) {
    this.nodes$ = new EventEmitter();
    this.poiMarkers$ = new EventEmitter();
    this.resetMarkers$ = new EventEmitter();
    this.initializeTripSetupForm();
    this.intermediateLocationForm = new FormGroup({
      address: new FormControl('')
    });
    this.initializePreferencesForm();
  }

  initializePreferencesForm() {
    this.preferencesForm = new FormGroup({
      maxNumberOfStops: new FormControl(3, [Validators.pattern('^[1-9]*$')]),
      maxDuration: new FormControl(6, Validators.pattern('^[1-9]*$')),
      budgetAmt: new FormControl('2')
    });
  }

  initializeTripSetupForm() {
    this.tripSetupForm = new FormGroup({
      startingLocation: new FormControl(''),
      endingLocation: new FormControl('')
    });
  }

  setListOfNodes(nodes) {
    this.nodes$.emit(nodes);
  }

  setPoiMarkers(coords) {
    console.log(coords);
    this.poiMarkers$.emit(coords);
  }

  resetMarkers() {
    this.resetMarkers$.emit();
  }

  route(startingLocation, endingLocation) {
    this.currentRoute = {
      startingLocation: startingLocation,
      endingLocation: endingLocation
    }
    return this.http.get(`./init/${startingLocation}-${endingLocation}`);
  }

  refreshTrip(preferencesForm: FormGroup) {
    const obj = {
      tripDurationPref: preferencesForm.get('maxDuration').value,
      numStopsPref: preferencesForm.get('maxNumberOfStops').value,
      budgetPref: preferencesForm.get('budgetAmt').value
    }

    return this.http.get(`./refresh/${obj.tripDurationPref}-${obj.numStopsPref}-${obj.budgetPref}`);
  }

  lockPOI(item) {
    return this.http.get(`./lockStop/${item.type}-${item.id}`);
  }

  unlockPOI(item) {
    return this.http.get(`./unlockStop/${item.type}-${item.id}`);
  }

  updateRating(item) {
    return this.http.get(`./setRating/${item.type}-${item.id}-${item.currentRating}`);
  }

}
