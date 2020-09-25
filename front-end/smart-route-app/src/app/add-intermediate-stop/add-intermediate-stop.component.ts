import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-intermediate-stop',
  templateUrl: './add-intermediate-stop.component.html',
  styleUrls: ['./add-intermediate-stop.component.scss']
})
export class AddIntermediateStopComponent implements OnInit {
  address: FormControl;

  constructor(public dialogRef: MatDialogRef<AddIntermediateStopComponent>) {
    this.address = new FormControl('');
  }

  ngOnInit(): void {
  }

  addLocation() {
    this.dialogRef.close(this.address);
  }

}
