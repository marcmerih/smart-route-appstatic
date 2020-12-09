import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouteModel, RouteObject } from './models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  tripSetupForm: FormGroup;
  intermediateLocationForm: FormGroup;
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

  route(startingLocation, endingLocation, maximumDetourDuration) {
    this.currentRoute = {
      startingLocation: startingLocation,
      endingLocation: endingLocation,
      maximumDetourDuration: maximumDetourDuration,
      stops: []
    }
    return this.http.get(`./dir/${startingLocation}-${endingLocation}-${maximumDetourDuration}`);
  }

  getIntermediate(startingLocation, endingLocation, maximumDetourDuration, stops) {
    this.currentRoute.stops.push(stops);
    return this.http.get<RouteModel>(`./add-stop/${startingLocation}-${endingLocation}-${maximumDetourDuration}-${stops}`);
  }
  
  getRestaurants() {
    return this.http.get(`./restaurants`);
  }

  poiLiked(poi) {
    console.log(poi);
  }

  poiDisliked(poi) {
    console.log(poi);
  }

  poiAdded(poi) {
    this.updateCurrentPOIs(poi);
    console.log(this.currentRoute.stops);
    return this.http.get<RouteModel>(`./add-stop/${this.currentRoute.startingLocation}-${this.currentRoute.endingLocation}-${this.currentRoute.maximumDetourDuration}-${this.currentRoute.stops}`);
  }

  orderOfStopsChanged(addresses) {
    this.currentRoute.stops = addresses;
    console.log(this.currentRoute);
    return this.http.get<RouteModel>(`./add-stop/${this.currentRoute.startingLocation}-${this.currentRoute.endingLocation}-${this.currentRoute.maximumDetourDuration}-${addresses}`);
  }

  updateCurrentPOIs(poi) {
    if (poi.currentLabel === 'add') {
      this.currentRoute.stops.push(poi.poi[1] + '-');
    } else {
      this.currentRoute.stops = this.currentRoute.stops.filter(x => {
        return x[0] != poi.poi[0];
      });
    }
  }
}
