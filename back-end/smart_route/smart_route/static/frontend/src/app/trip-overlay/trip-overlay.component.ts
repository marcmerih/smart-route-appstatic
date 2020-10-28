import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddIntermediateStopComponent } from '../add-intermediate-stop/add-intermediate-stop.component';
import { TripService } from '../trip.service';
import { FormGroup } from '@angular/forms';
import { TripSettingsComponent } from '../trip-settings/trip-settings.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
export enum RoutingSteps {
  routeStartEnd = 0,
  tripDetails = 1
}

export class RouteModel {
  listOfNodes: number[][];
}
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
  addresses = []
  currentRoute: any;

  restaurantClicked = false;
  hotelsClicked = false;
  ttdClicked = false;

  constructor(private dialog: MatDialog, private router: Router,
    private tripService: TripService, private http: HttpClient) {
    this.startTripForm = this.tripService.tripSetupForm;
  }

  ngOnInit(): void {
  }

  route() {
    this.hasBeenRouted = true;
    this.currentStep = this.routingSteps.tripDetails;
    this.http.get<RouteModel>(`./dir/${this.startingLocation}-${this.endingLocation}`).subscribe(request => {
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

    });
  }

  addIntermediaryAddress() {
    let dialogRef = this.dialog.open(AddIntermediateStopComponent, {
      height: '40vh',
      width: '40vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      // Make a backend call to update route with added stop.
      this.addresses.push(result.value);
      this.intermediateLocationAddress = result.value;
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
