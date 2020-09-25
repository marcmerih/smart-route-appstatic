import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddIntermediateStopComponent } from '../add-intermediate-stop/add-intermediate-stop.component';
import { TripService } from '../trip.service';
import { FormGroup } from '@angular/forms';
export enum RoutingSteps {
  routeStartEnd = 0,
  tripDetails = 1
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

  constructor(private dialog: MatDialog, private tripService: TripService) {
    this.startTripForm = this.tripService.tripSetupForm;
  }

  ngOnInit(): void {
  }

  route() {
    this.hasBeenRouted = true;
    this.currentStep = this.routingSteps.tripDetails;
  }

  addIntermediaryAddress() {
    let dialogRef = this.dialog.open(AddIntermediateStopComponent, {
      height: '25vh',
      width: '25vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      // Make a backend call to update route with added stop.
      this.addresses.push(result.value);
      this.intermediateLocationAddress = result.value;
    });
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
