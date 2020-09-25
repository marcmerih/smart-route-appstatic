import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trip-overlay',
  templateUrl: './trip-overlay.component.html',
  styleUrls: ['./trip-overlay.component.scss']
})
export class TripOverlayComponent implements OnInit {
  hasBeenRouted = true;
  constructor() { }

  ngOnInit(): void {
  }

}
