import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouteModel } from './models';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  tripSetupForm: FormGroup;
  intermediateLocationForm: FormGroup;
  public nodes$: EventEmitter<string>;
  public poiMarkers$: EventEmitter<string>;

  constructor(private http: HttpClient) {
    this.nodes$ = new EventEmitter();
    this.poiMarkers$ = new EventEmitter();
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

  setPoiMarkers(coords) {
    this.poiMarkers$.emit(coords);
  }

  route(startingLocation, endingLocation, maximumDetourDuration) {
    return this.http.get(`./dir/${startingLocation}-${endingLocation}-${maximumDetourDuration}`);
  }

  getIntermediate(startingLocation, endingLocation, maximumDetourDuration, addresses) {
    return this.http.get<RouteModel>(`./intermediate/${startingLocation}-${endingLocation}-${maximumDetourDuration}-${addresses}`);
  }
  
  getRestaurants() {
    return this.http.get('route/restaurant/');
  }
}
