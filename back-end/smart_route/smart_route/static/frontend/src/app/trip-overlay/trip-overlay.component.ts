import { Component, OnInit } from '@angular/core';
import { TripService } from '../trip.service';
import { FormGroup, Form, FormControl, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { RoutingSteps, RouteModel } from '../models';
import { MatChipInputEvent } from '@angular/material/chips';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoaderService } from '../loader/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-overlay',
  templateUrl: './trip-overlay.component.html',
  styleUrls: ['./trip-overlay.component.scss']
})
export class TripOverlayComponent implements OnInit {
  editPreferencesClicked = false;
  hasBeenRouted = false;
  // poiis = [{'id': '125','lat': '43.648505','lon': '-79.38668700000001','name': 'Tim Hortons','address': '123 Test Rd','resTags': '["Asian", "Buffet"]','cuisineOptions': '["Vegan"]','reviewsURL': "https://www.google.ca",'type':'res','tripAdvisorRating': '4.6','usersMatchPercentage': '5','img':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 'isExpanded': false, 'isLocked': false, 'currentRating': 0}];
  // tripStops = [
  //   // Restaurant
  //   { 
  //     img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 
  //     tags: ['Asian', 'Buffet'],
  //     name: "Bjrog's Lobster & Fish",
  //     address: '1250 Bay Street, Toronto, Ontario',
  //     isExpanded: false,
  //     cuisineOptions: ['Vegan'],
  //     currentRate: 0,
  //     reviewsUrl: '',
  //     id: 'R123',
  //     type: 'res',
  //     lat: 'asd',
  //     lon: 'asd',
  //     isLocked: false,
  //     usersMatchPercentage: 0,
  //     tripAdvisorRating: 4.7
  //   },
  //   // TTD
  //   { 
  //     img: 'https://www.niemanlab.org/images/hollywood-sign.jpg', 
  //     tags: ['Parks', 'Nature', 'Wildlife'],
  //     name: 'Algonquin Reservation',
  //     address: '1234 Lake Oaowa, Ontario',
  //     isExpanded: false,
  //     currentRate: 0,
  //     reviewsUrl: '',
  //     id: 'T04',
  //     type: 'ttd',
  //     lat: 'asd',
  //     lon: 'asd',
  //     isLocked: false,
  //     usersMatchPercentage: 0,
  //     tripAdvisorRating: 4.1
  //   },
  //   // Hotel
  //   { 
  //     img: 'https://images.vailresorts.com/image/fetch/ar_4:3,c_scale,dpr_3.0,f_auto,q_auto,w_400/https://images.vrinntopia.com/photos/854813/854813-123.jpg', 
  //     amenities: ['Free Breakfast', 'Free Wi-fi', 'Pool'], 
  //     isExpanded: false,
  //     name: 'Best Western Kawartha',
  //     address: '1234 Kawartha Lakes Drive, Ontario',
  //     currentRate: 0,
  //     reviewsUrl: '',
  //     id: 'H64',
  //     lat: 'asd',
  //     lon: 'asd',
  //     type: 'hotel',
  //     isLocked: false,
  //     usersMatchPercentage: 0,
  //     tripAdvisorRating: 3.9
  //   },
  // ];

  routingSteps: any = RoutingSteps;
  currentStep: RoutingSteps = RoutingSteps.routeStartEnd;
  startTripForm: FormGroup;
  preferencesForm: FormGroup;
  intermediatePreferencesForm: FormGroup;
  currentRoute;
  removable = true;
  visible = true;
  selectable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  currentStops;
  categories = [
      {name: 'Restaurant', completed: false, color: 'primary'},
      {name: 'Hotels', completed: false, color: 'primary'},
      {name: 'Things to do', completed: false, color: 'primary'}
  ];
  allComplete: boolean = false;
  tags = [];

  constructor(private tripService: TripService, private router: Router) {
    this.startTripForm = this.tripService.tripSetupForm;
    this.preferencesForm = this.tripService.preferencesForm;
    this.intermediatePreferencesForm = new FormGroup({
      maxNumberOfStops: new FormControl(3, [Validators.pattern('^[1-9]*$')]),
      maxDuration: new FormControl(6, Validators.pattern('^[1-9]*$')),
      budgetAmt: new FormControl('$$')
    })
  }

  ngOnInit(): void {
  }

  updateAllComplete() {
    this.allComplete = this.categories != null && this.categories.every(t => t.completed);
  }

  route() {
    this.hasBeenRouted = true;
    this.currentStep = this.routingSteps.tripDetails;

    this.tripService.route(this.startingLocation, this.endingLocation).subscribe((request: RouteModel) => {
      this.currentRoute = JSON.parse(request.route);
      this.currentStops = JSON.parse(request.stops);
      console.log(this.currentRoute);
      console.log(this.currentStops);
      this.tripService.setListOfNodes(this.currentRoute);
      let stopsCoords = [];
      this.currentStops.forEach(stop => {
        stopsCoords.push([stop.lat, stop.lon]);
      });
      this.tripService.setPoiMarkers(stopsCoords);
    });
  }

  clickEditPreferences(override?: boolean) {
    console.log('here')
    if (!this.editPreferencesClicked || override) {
      this.editPreferencesClicked = !this.editPreferencesClicked;
    }
  }

  closePreferences() {
    this.clickEditPreferences(true);
    this.intermediatePreferencesForm.get('maxNumberOfStops').setValue(this.preferencesForm.get('maxNumberOfStops').value);
    this.intermediatePreferencesForm.get('maxDuration').setValue(this.preferencesForm.get('maxDuration').value);
    this.intermediatePreferencesForm.get('budgetAmt').setValue(this.preferencesForm.get('budgetAmt').value);
  }

  updatePreferences() {
    this.clickEditPreferences(true);
    this.preferencesForm.get('maxNumberOfStops').setValue(this.intermediatePreferencesForm.get('maxNumberOfStops').value);
    this.preferencesForm.get('maxDuration').setValue(this.intermediatePreferencesForm.get('maxDuration').value);
    this.preferencesForm.get('budgetAmt').setValue(this.intermediatePreferencesForm.get('budgetAmt').value);
  }

  incrementNumStops() {
    if (this.intermediatePreferencesForm.get('maxNumberOfStops').value !== 6) {
      this.intermediatePreferencesForm.get('maxNumberOfStops').setValue(Number(this.intermediatePreferencesForm.get('maxNumberOfStops').value + 1));
    }
  }

  decrementNumStops() {    
    if (this.intermediatePreferencesForm.get('maxNumberOfStops').value !== 0) {
      this.intermediatePreferencesForm.get('maxNumberOfStops').setValue(Number(this.intermediatePreferencesForm.get('maxNumberOfStops').value - 1));
    }
  }

  incrementDuration() {
    if (this.intermediatePreferencesForm.get('maxDuration').value !== 9) {
      this.intermediatePreferencesForm.get('maxDuration').setValue(Number(this.intermediatePreferencesForm.get('maxDuration').value + 1));
    }
  }
  
  decrementDuration() {
    if (this.intermediatePreferencesForm.get('maxDuration').value !== 0) {
      this.intermediatePreferencesForm.get('maxDuration').setValue(Number(this.intermediatePreferencesForm.get('maxDuration').value - 1));
    }
  }

  setBudget(dollarAmt: string) {
    this.intermediatePreferencesForm.get('budgetAmt').setValue(dollarAmt);
    console.log(this.intermediatePreferencesForm.get('budgetAmt').value)
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  refreshTrip() {
    this.tripService.refreshTrip(this.preferencesForm).subscribe((request: RouteModel) => {
      this.currentRoute = JSON.parse(request.route);
      this.currentStops = JSON.parse(request.stops);
      console.log(this.currentRoute);
      console.log(this.currentStops);
      this.tripService.setListOfNodes(this.currentRoute);
    });
  }

  startOver() {
    this.tripService.resetMarkers();
    this.tripService.initializePreferencesForm();
    this.tripService.initializeTripSetupForm();

    this.preferencesForm = this.tripService.preferencesForm;
    this.startTripForm = this.tripService.tripSetupForm;
    this.currentStep = 0;
  }

  get getCurrentStops() {
    if (this.currentStops) {
      return this.currentStops;
    }
  }
  get startingLocation() {
    return this.startTripForm.get('startingLocation').value;
  }

  get endingLocation() {
    return this.startTripForm.get('endingLocation').value;
  }

  get isRouteDisabled() {
    return !(this.startTripForm.get('startingLocation').value &&
      this.startTripForm.get('endingLocation').value)
  }

}
