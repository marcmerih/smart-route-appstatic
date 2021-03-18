import { Component, OnInit, Inject } from '@angular/core';
import { TripService } from '../trip.service';
import { FormGroup, Form, FormControl, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { RoutingSteps, RouteModel } from '../models';
import { MatChipInputEvent } from '@angular/material/chips';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoaderService } from '../loader/loader.service';
import { Router } from '@angular/router';
import { UserService } from '../accounts/user.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-trip-overlay',
  templateUrl: './trip-overlay.component.html',
  styleUrls: ['./trip-overlay.component.scss']
})
export class TripOverlayComponent implements OnInit {
  editPreferencesClicked = false;
  hasBeenRouted = false;
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
  constructor(private tripService: TripService, private router: Router, private userService: UserService, @Inject(DOCUMENT) private document: Document) {
    this.startTripForm = this.tripService.tripSetupForm;
    this.preferencesForm = this.tripService.preferencesForm;
    this.intermediatePreferencesForm = new FormGroup({
      maxNumberOfStops: new FormControl(3, [Validators.pattern('^[1-9]*$')]),
      maxDuration: new FormControl(6, Validators.pattern('^[1-9]*$')),
      budgetAmt: new FormControl('4')
    })
  }

  ngOnInit(): void {
  }

  updateAllComplete() {
    this.allComplete = this.categories != null && this.categories.every(t => t.completed);
  }

  route() {
    this.hasBeenRouted = true;
    this.tripService.routed = true;
    this.currentStep = this.routingSteps.tripDetails;

    this.tripService.route(this.startingLocation, this.endingLocation).subscribe((request: RouteModel) => {
      this.currentRoute = request.route;
      this.currentStops = request.stops;
      this.tripService.setListOfNodes(this.currentRoute);
      let stopsCoords = [];
      this.currentStops.forEach(stop => {
        stopsCoords.push([stop.lon, stop.lat]);
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
      this.tripService.resetMarkers();
      this.currentRoute = request.route;
      this.currentStops = request.stops;
      console.log(this.currentRoute);
      console.log(this.currentStops);
      this.tripService.setListOfNodes(this.currentRoute);
    });
  }

  startOver() {
    this.tripService.resetMarkers();
    this.tripService.resetRoute();
    this.tripService.initializePreferencesForm();
    this.tripService.initializeTripSetupForm();
    this.tripService.routed = false;

    this.preferencesForm = this.tripService.preferencesForm;
    this.startTripForm = this.tripService.tripSetupForm;
    this.currentStep = 0;
  }

  letsGo() {
    this.document.location.href = 'http://www.inago.com/';
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
    return (!(this.startTripForm.get('startingLocation').value &&
      this.startTripForm.get('endingLocation').value) || !this.userService.userSignedIn);
  }

}
