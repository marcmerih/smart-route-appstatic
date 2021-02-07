import { Component, OnInit } from '@angular/core';
import { TripService } from '../trip.service';
import { FormGroup } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { RoutingSteps, RouteModel } from '../models';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-trip-overlay',
  templateUrl: './trip-overlay.component.html',
  styleUrls: ['./trip-overlay.component.scss']
})
export class TripOverlayComponent implements OnInit {
  editPreferencesClicked = false;
  hasBeenRouted = false;
  
  tripStops = [
    // Restaurant
    { 
      img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 
      tags: ['Asian', 'Buffet'],
      name: "Bjrog's Lobster & Fish",
      address: '1250 Bay Street, Toronto, Ontario',
      isExpanded: false,
      cuisineOptions: ['Vegan'],
      currentRate: 0,
      reviewsUrl: '',
      id: 'R123',
      type: 'res',
      isLocked: false,
      usersMatchPercentage: 0,
      tripAdvisorRating: 4.7
    },
    // TTD
    { 
      img: 'https://www.niemanlab.org/images/hollywood-sign.jpg', 
      tags: ['Parks', 'Nature', 'Wildlife'],
      name: 'Algonquin Reservation',
      address: '1234 Lake Oaowa, Ontario',
      isExpanded: false,
      currentRate: 0,
      reviewsUrl: '',
      id: 'T04',
      type: 'ttd',
      isLocked: false,
      usersMatchPercentage: 0,
      tripAdvisorRating: 4.1
    },
    // Hotel
    { 
      img: 'https://images.vailresorts.com/image/fetch/ar_4:3,c_scale,dpr_3.0,f_auto,q_auto,w_400/https://images.vrinntopia.com/photos/854813/854813-123.jpg', 
      amenities: ['Free Breakfast', 'Free Wi-fi', 'Pool'], 
      isExpanded: false,
      name: 'Best Western Kawartha',
      address: '1234 Kawartha Lakes Drive, Ontario',
      currentRate: 0,
      reviewsUrl: '',
      id: 'H64',
      type: 'hotel',
      isLocked: false,
      usersMatchPercentage: 0,
      tripAdvisorRating: 3.9
    },
  ];

  routingSteps: any = RoutingSteps;
  currentStep: RoutingSteps = RoutingSteps.routeStartEnd;
  startTripForm: FormGroup;
  preferencesForm: FormGroup;
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

  mockRestaurants = 
  {
    "listOfRestaurantsInfo": [['Prime Steakhouse Niagara Falls', '5685 Falls Avenue, Niagara Falls, Ontario L2E 6W7 Canada', 4.8],
    ['Est Restaurant', '729 Queen St E, Toronto, Ontario M4M 1H1 Canada', 4.8],
    ["lo Presti's at Maxwell's", 'Jackson st.e, Hamilton, Ontario Canada', 4.7],
    ['Tide and Vine Oyster House', '3491 Portage Rd, Niagara Falls, Ontario L2J 2K5 Canada', 4.7],
    ['Beechwood Doughnuts', '165 St. Paul Street, St. Catharines, Ontario L2R 3M5 Canada', 4.7],
    ['Marcs Place', '165 St. Paul Street, St. Catharines, Ontario L2R 3M5 Canada', 4.7]],
    "listOfRestaurantsCoords": [[-79.07169652, 43.09269115], [-79.3489562, 43.65893534], [-79.86933370000001, 43.2543027], [-79.09977664, 43.1215245], [-79.24467442, 43.15773514], [-79.596524, 43.613142]] 
  };

  mockHotels = 
  {
    "listOfHotelsInfo": [['Hotels Steakhouse Niagara Falls', '5685 Falls Avenue, Niagara Falls, Ontario L2E 6W7 Canada', 4.8],
    ['Est Restaurant', '729 Queen St E, Toronto, Ontario M4M 1H1 Canada', 4.8],
    ["lo Presti's at Maxwell's", 'Jackson st.e, Hamilton, Ontario Canada', 4.7],
    ['Tide and Vine Oyster House', '3491 Portage Rd, Niagara Falls, Ontario L2J 2K5 Canada', 4.7],
    ['Beechwood Doughnuts', '165 St. Paul Street, St. Catharines, Ontario L2R 3M5 Canada', 4.7]],
    "listOfHotelsCoords": [[-79.07169652, 43.09269115], [-79.3489562, 43.65893534], [-79.86933370000001, 43.2543027], [-79.09977664, 43.1215245], [-79.24467442, 43.15773514]] 
  };

  mockTTD = 
  {
    "listOfTTDInfo": [['TTD Steakhouse Niagara Falls', '5685 Falls Avenue, Niagara Falls, Ontario L2E 6W7 Canada', 4.8],
    ['Est Restaurant', '729 Queen St E, Toronto, Ontario M4M 1H1 Canada', 4.8],
    ["lo Presti's at Maxwell's", 'Jackson st.e, Hamilton, Ontario Canada', 4.7],
    ['Tide and Vine Oyster House', '3491 Portage Rd, Niagara Falls, Ontario L2J 2K5 Canada', 4.7],
    ['Beechwood Doughnuts', '165 St. Paul Street, St. Catharines, Ontario L2R 3M5 Canada', 4.7],
    ['Legend Steakhouse Niagara Falls', '5685 Falls Avenue, Niagara Falls, Ontario L2E 6W7 Canada', 4.8],
    ['Est Restaurant', '729 Queen St E, Toronto, Ontario M4M 1H1 Canada', 4.8],
    ["lo Presti's at Maxwell's", 'Jackson st.e, Hamilton, Ontario Canada', 4.7],
    ['Tide and Vine Oyster House', '3491 Portage Rd, Niagara Falls, Ontario L2J 2K5 Canada', 4.7],
    ['Beechwood Doughnuts', '165 St. Paul Street, St. Catharines, Ontario L2R 3M5 Canada', 4.7],
    ['Estate Palace', '216 Dundas ST W, Belleville, Ontario L2R 3M5 Canada', 4.7]],
    "listOfTTDCoords": [[-79.07169652, 43.09269115], [-79.3489562, 43.65893534], [-79.86933370000001, 43.2543027], [-79.09977664, 43.1215245], [-79.24467442, 43.15773514], [-79.07169652, 43.09269115], [-79.3489562, 43.65893534], [-79.86933370000001, 43.2543027], [-79.09977664, 43.1215245], [-79.24467442, 43.15773514], [-77.395401, 44.153139]] 
  };

  constructor(private tripService: TripService) {
    this.startTripForm = this.tripService.tripSetupForm;
    this.preferencesForm = this.tripService.preferencesForm;
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
      this.currentStops = JSON.parse(request.stops)
      console.log(this.currentRoute);
      console.log(this.currentStops);
      this.tripService.setListOfNodes(this.currentRoute);
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
  }

  updatePreferences() {
    // make a backend update call here
    this.closePreferences();
  }

  incrementNumStops() {
    if (this.preferencesForm.get('maxNumberOfStops').value !== 6) {
      this.preferencesForm.get('maxNumberOfStops').setValue(Number(this.preferencesForm.get('maxNumberOfStops').value + 1));
    }
  }

  decrementNumStops() {    
    if (this.preferencesForm.get('maxNumberOfStops').value !== 0) {
      this.preferencesForm.get('maxNumberOfStops').setValue(Number(this.preferencesForm.get('maxNumberOfStops').value - 1));
    }
  }

  incrementDuration() {
    if (this.preferencesForm.get('maxDuration').value !== 9) {
      this.preferencesForm.get('maxDuration').setValue(Number(this.preferencesForm.get('maxDuration').value + 1));
    }
  }
  
  decrementDuration() {
    if (this.preferencesForm.get('maxDuration').value !== 0) {
      this.preferencesForm.get('maxDuration').setValue(Number(this.preferencesForm.get('maxDuration').value - 1));
    }
  }

  setBudget(dollarAmt: string) {
    this.preferencesForm.get('budgetAmt').setValue(dollarAmt);
    console.log(this.preferencesForm.get('budgetAmt').value)
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
