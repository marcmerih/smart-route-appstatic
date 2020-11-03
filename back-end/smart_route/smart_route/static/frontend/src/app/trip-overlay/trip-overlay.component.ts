import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddIntermediateStopComponent } from '../add-intermediate-stop/add-intermediate-stop.component';
import { TripService } from '../trip.service';
import { FormGroup } from '@angular/forms';
import { TripSettingsComponent } from '../trip-settings/trip-settings.component';
import { HttpClient } from '@angular/common/http';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { RoutesComponent } from '../routes/routes.component';
import { RoutingSteps, TripSettings, RouteModel } from '../models'

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

  constructor(private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute,
    private tripService: TripService, private http: HttpClient) {
    this.startTripForm = this.tripService.tripSetupForm;
    this.tripSettings.maximumDetourDuration = 100;
  }

  ngOnInit(): void {
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
    this.http.get<RouteModel>(`./dir/${this.startingLocation}-${this.endingLocation}-${this.tripSettings.maximumDetourDuration}`).subscribe(request => {
      // send list of addresses to backend as well. If addresses.length == 2, then just do Route(starting, ending), if length > 2, go through
      // list of addresses and route between each 2 locations, append all list of nodes (ensuring there is no overlap), and return that list (this is for intermediate addresses and POIs)
      this.currentRoute = request.listOfNodes;
      console.log(this.currentRoute);
    });

    // Things required to do:
    //  1) Transform current route into list of arrays from list of tuples.
    //  2) Set current route equal to a service variable (in trip service) that is accessible globally
    //  3) In routes.component.ts, process the variable as a vectorlayer, and add that layer onto the map.

    this.currentRoute = "[(43.6133961, -79.5962764), (43.6134212, -79.5962996), (43.6134489, -79.596312)]";
    this.tripService.listOfNodes = this.currentRoute;
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
        this.http.get<RouteModel>(`./intermediate/${this.startingLocation}-${this.endingLocation}-${this.tripSettings.maximumDetourDuration}-${this.addresses}`).subscribe(request => {
          // send list of addresses to backend as well. If addresses.length == 2, then just do Route(starting, ending), if length > 2, go through
          // list of addresses and route between each 2 locations, append all list of nodes (ensuring there is no overlap), and return that list (this is for intermediate addresses and POIs)
          this.currentRoute = request.listOfNodes;
          console.log(this.currentRoute);
        });

      }
    });
  }

  hasBeenClicked(tag: string) {
    if (tag === 'restaurant') {
      this.restaurantClicked = !this.restaurantClicked;
    } else if (tag === 'hotels') {
      this.hotelsClicked = !this.hotelsClicked;
    } else {
      this.ttdClicked = !this.ttdClicked;
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
