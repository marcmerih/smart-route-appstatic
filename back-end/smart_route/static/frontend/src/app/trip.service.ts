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
    this.tripSetupForm = new FormGroup({
      startingLocation: new FormControl(''),
      endingLocation: new FormControl('')
    });

    this.intermediateLocationForm = new FormGroup({
      address: new FormControl('')
    });

    this.preferencesForm = new FormGroup({
      maxNumberOfStops: new FormControl(3, [Validators.pattern('^[1-9]*$')]),
      maxDuration: new FormControl(6, Validators.pattern('^[1-9]*$')),
      budgetAmt: new FormControl('$$')
    })
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

}
