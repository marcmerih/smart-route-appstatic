import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddIntermediateStopComponent } from '../add-intermediate-stop/add-intermediate-stop.component';
import { TripService } from '../trip.service';
import { FormGroup } from '@angular/forms';
import { TripSettingsComponent } from '../trip-settings/trip-settings.component';
import { HttpClient } from '@angular/common/http';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { RoutesComponent } from '../routes/routes.component';
import { RoutingSteps, TripSettings, RouteModel, RestaurantsModel } from '../models';

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
  intermediateLocationAddress = '';
  addresses = [];
  currentRoute: any;
  restaurantClicked = false;
  hotelsClicked = false;
  ttdClicked = false;
  tripSettings: TripSettings = new TripSettings;
  restaurants;
  mockRestaurants = `
  {
    "listOfRestaurantsInfo": "[['Prime Steakhouse Niagara Falls', '5685 Falls Avenue, Niagara Falls, Ontario L2E 6W7 Canada', 4.8]]", 
    "listOfRestaurantsCoords": "[[-79.07169652, 43.09269115], [-79.3489562, 43.65893534], [-79.86933370000001, 43.2543027], [-79.09977664, 43.1215245], [-79.24467442, 43.15773514]]" }`;


  constructor(private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute,
    private tripService: TripService, private http: HttpClient) {
    this.startTripForm = this.tripService.tripSetupForm;
    this.tripSettings.maximumDetourDuration = 100;
    this.restaurants = [];
  }

  ngOnInit(): void {
    this.restaurants = JSON.parse(this.mockRestaurants);
    console.log(this.restaurants);
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

    // Things required to do:
    //  1) Transform current route into list of arrays from list of tuples.
    //  2) Set current route equal to a service variable (in trip service) that is accessible globally
    //  3) In routes.component.ts, process the variable as a vectorlayer, and add that layer onto the map.
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

  addIntermediaryAddress() {
    let dialogRef = this.dialog.open(AddIntermediateStopComponent, {
      height: '40vh',
      width: '40vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      // Make a backend call to update route with added stop.
      if (result) {
        this.addresses.push(result.value);
        this.intermediateLocationAddress = result.value;
        let joinedAddress = this.addresses.join(',');

        const queryParams: Params = { 
          startingLocation: this.startingLocation, 
          endingLocation: this.endingLocation,
          intermediateLocation: joinedAddress
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
        this.tripService.getIntermediate(this.startingLocation, this.endingLocation, this.tripSettings.maximumDetourDuration, this.addresses).subscribe(request => {
          // send list of addresses to backend as well. If addresses.length == 2, then just do Route(starting, ending), if length > 2, go through
          // list of addresses and route between each 2 locations, append all list of nodes (ensuring there is no overlap), and return that list (this is for intermediate addresses and POIs)
          this.currentRoute = JSON.parse(request.listOfNodes);
        });

        this.tripService.setListOfNodes(this.currentRoute);
      }
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
      this.tripService.getRestaurants().subscribe((request: RestaurantsModel) => {
        // this.tripService.setPoiMarkers(JSON.parse(request.listOfRestaurantsCoords));
        // this.restaurants = JSON.parse(request.listOfRestaurantsInfo);
        // console.log(JSON.parse(request.listOfRestaurantsInfo));
        // console.log(JSON.parse(request.listOfRestaurantsCoords));
      });

      const currentRestaurant: RestaurantsModel = JSON.parse(this.mockRestaurants);
      this.tripService.setPoiMarkers(JSON.parse(currentRestaurant.listOfRestaurantsCoords));
      // this.restaurants = JSON.parse(currentRestaurant.listOfRestaurantsInfo);
    }
  }

  displayHotels() {
    this.hotelsClicked = !this.hotelsClicked;
    // Add API call here.
  }

  displayTTD() {
    this.ttdClicked = !this.ttdClicked;
    // Add API call here;
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
