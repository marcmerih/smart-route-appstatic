import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddIntermediateStopComponent } from '../add-intermediate-stop/add-intermediate-stop.component';
import { TripService } from '../trip.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TripSettingsComponent } from '../trip-settings/trip-settings.component';
import { HttpClient } from '@angular/common/http';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { RoutesComponent } from '../routes/routes.component';
import { RoutingSteps, TripSettings, RouteModel, RestaurantsModel } from '../models';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-trip-overlay',
  templateUrl: './trip-overlay.component.html',
  styleUrls: ['./trip-overlay.component.scss']
})
export class TripOverlayComponent implements OnInit {
  hasBeenRouted = false;
  routingSteps: any = RoutingSteps;
  currentStep: RoutingSteps = RoutingSteps.routeStartEnd;
  startTripForm: FormGroup;
  sortFormGroup: FormGroup;
  intermediateLocationAddress = '';
  addresses = [];
  currentRoute: any;
  pageSlice;
  restaurantClicked = false;
  hotelsClicked = false;
  ttdClicked = false;
  tripSettings: TripSettings = new TripSettings;
  restaurants;
  restaurantsCoords;
  hotelsCoords;
  ttdsCoords;
  hotels;
  ttds;
  sortOptions = [
    {value: 'recommended', viewValue: 'Recommended'},
    {value: 'price-ascending', viewValue: 'Price: High-to-Low'},
    {value: 'price-descending', viewValue: 'Price: Low-to-High'}
  ];
  defaulOption = {value: 'recommended', viewValue: 'Recommended'};
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

  constructor(private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute,
    private tripService: TripService, private http: HttpClient) {
    this.startTripForm = this.tripService.tripSetupForm;
    this.sortFormGroup = new FormGroup({
      sortBy: new FormControl('')
    });
    this.tripSettings.maximumDetourDuration = 3;
    this.restaurants = [];
    this.restaurantsCoords = [];
    this.hotels = [];
    this.hotelsCoords = [];
    this.ttds = [];
    this.ttdsCoords = [];
  }

  ngOnInit(): void {
    // this.restaurants = this.mockRestaurants;
    // console.log(this.restaurants);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.addresses, event.previousIndex, event.currentIndex);
    console.log(this.addresses);
    this.tripService.orderOfStopsChanged(this.addresses).subscribe(request => {
      this.currentRoute = JSON.parse(request.listOfNodes)
      this.tripService.setListOfNodes(this.currentRoute);
    })
  }

  route() {
    const queryParams: Params = { startingLocation: this.startingLocation, 
      endingLocation: this.endingLocation,
      maximumDetour: this.tripSettings.maximumDetourDuration  
    };
    this.router.navigate(
      [], 
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams, 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });

    this.hasBeenRouted = true;
    this.currentStep = this.routingSteps.tripDetails;
    this.tripService.route(this.startingLocation, this.endingLocation, this.tripSettings.maximumDetourDuration).subscribe((request: RouteModel) => {
      this.currentRoute = JSON.parse(request.listOfNodes)
      this.tripService.setListOfNodes(this.currentRoute);
    });
  }

  explore() {
    console.log("oops");
  }

  openTripSettings() {
    let dialogRefSettings = this.dialog.open(TripSettingsComponent, {
      height: '60vh',
      width: '60vw'
    });

    dialogRefSettings.afterClosed().subscribe(result => {
      this.tripSettings.maximumDetourDuration = result;
    });
  }

  hasBeenClicked(tag: string) {
    if (tag === 'restaurant') {
      this.displayRestaurants();
    } else if (tag === 'hotels') {
      this.displayHotels();
    } else {
      this.displayTTD();
    }
  }

  displayRestaurants() {
    this.restaurantClicked = !this.restaurantClicked;
    if (this.restaurantClicked) {
      this.hotelsClicked = false;
      this.ttdClicked = false;
      this.getRestaurants();
    }
  }

  displayHotels() {
    this.hotelsClicked = !this.hotelsClicked;
    if (this.hotelsClicked) {
      this.restaurantClicked = false;
      this.ttdClicked = false;
      this.getHotels();

      const currentHotel = this.mockHotels;
      this.hotels = currentHotel.listOfHotelsInfo;
      this.hotelsCoords = currentHotel.listOfHotelsCoords;
    }
  }

  displayTTD() {
    this.ttdClicked = !this.ttdClicked;
    if (this.ttdClicked) {
      this.restaurantClicked = false;
      this.hotelsClicked = false;
      this.getTTD();

      const currentTTD = this.mockTTD;
      this.ttds = currentTTD.listOfTTDInfo;
      this.ttdsCoords = currentTTD.listOfTTDCoords;
    }
  }

  sortBySelected($event) {
    console.log($event);
  }

  poiAdded($event) {
    this.tripService.poiAdded($event).subscribe(request => {
      this.currentRoute = JSON.parse(request.listOfNodes);
      this.tripService.setListOfNodes(this.currentRoute);
      this.updateAddresses($event);
      console.log(this.addresses)
    });
  }

  poiLiked($event) {
    this.tripService.poiLiked($event);
  }

  poiDisliked($event) {
    this.tripService.poiDisliked($event);
  }

  updateAddresses(poi) {
    if (poi.currentLabel === 'add') {
      this.addresses.push(poi.poi[1])
    } else {
      this.addresses = this.addresses.filter(x => {
        return x[0] != poi.poi[1];
      });
    }
  }

  captureValue($event) {
    return $event + 'km';
    // Call endpoint to change detour distance here.
  }

  updateMaximumDetour($event) {
    this.tripSettings.maximumDetourDuration = $event.value;
    this.tripService.route(this.startingLocation, this.endingLocation, this.tripSettings.maximumDetourDuration).subscribe((request: RouteModel) => {
      this.currentRoute = JSON.parse(request.listOfNodes)
      this.tripService.setListOfNodes(this.currentRoute);
      if (this.restaurantClicked) {
        this.getRestaurants();
      } else if (this.hotelsClicked) {
        this.getHotels();
      } else {
        this.getTTD();
      }
    });
  }

  onPageChange($event: PageEvent) {
    console.log(this.ttdsCoords);
    let currentArray;
    let currentArrayCoords;
    if (this.restaurantClicked) {
      currentArray = this.restaurants;
      currentArrayCoords = this.restaurantsCoords;
    } else if (this.hotelsClicked) {
      currentArray = this.hotels;
      currentArrayCoords = this.hotelsCoords;
    } else {
      currentArray = this.ttds;
      currentArrayCoords = this.ttdsCoords;
    }

    const startIndex = $event.pageIndex * $event.pageSize;
    let endIndex = startIndex + $event.pageSize - 1;
    if (endIndex > currentArray.length) {
      endIndex = currentArray.length;
    }
    this.pageSlice = currentArray.slice(startIndex, endIndex);
    this.tripService.setPoiMarkers(currentArrayCoords.slice(startIndex,endIndex));
  }

  getRestaurants() {
    this.tripService.getRestaurants().subscribe((request: RestaurantsModel) => {
      this.restaurants = request.listOfRestaurantsInfo;
      this.restaurantsCoords = request.listOfRestaurantsCoords
      this.pageSlice = this.restaurants.slice(0,9);
      this.tripService.setPoiMarkers(this.restaurantsCoords.slice(0,9));
    });

    // this.restaurants = this.mockRestaurants.listOfRestaurantsInfo;
    // this.restaurantsCoords = this.mockRestaurants.listOfRestaurantsCoords;
    // this.pageSlice = this.restaurants.slice(0,9);
    // this.tripService.setPoiMarkers(this.restaurantsCoords.slice(0,9));
  }

  getHotels() {
    // this.tripService.getHotels().subscribe((request: HotelsModel) => {
      // this.hotels = request.listOfHotelsInfo;
      // this.hotelsCoords = request.listOfHotelsCoords
      // this.pageSlice = this.hotels.slice(0, 9);
      // this.tripService.setPoiMarkers(this.hotelsCoords.slice(0,9));
    // });
  }

  getTTD() {
    // this.tripService.getTTD().subscribe((request: HotelsModel) => {
    //   this.ttds = request.listOfTTDInfo;
    // this.ttdsCoords = request.listOfTTDCoords;
    // this.pageSlice = this.ttds.slice(0,10);
    //   console.log(request.listOfTTDsInfo);
    // });

    this.ttds = this.mockTTD.listOfTTDInfo;
    this.ttdsCoords = this.mockTTD.listOfTTDCoords;
    this.pageSlice = this.ttds.slice(0,9);
    this.tripService.setPoiMarkers(this.ttdsCoords.slice(0,9));
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
