import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-trip-settings',
  templateUrl: './trip-settings.component.html',
  styleUrls: ['./trip-settings.component.scss']
})
export class TripSettingsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TripSettingsComponent>) { }

  ngOnInit(): void {
  }

  addLocation() {
    // if () {
    //   this.dialogRef.close(this.address);
    // }
  }

  close() {
    this.dialogRef.close();
  }

  get isDisabled() {
    return;
  }
}
