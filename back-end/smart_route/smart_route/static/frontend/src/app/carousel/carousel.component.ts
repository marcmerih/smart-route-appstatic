import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() items;
  @Input() startingLocation;
  @Input() endingLocation;
  
  constructor() { }

  ngOnInit(): void {
    if (this.startingLocation.includes(',')) {
      this.startingLocation = this.startingLocation.split(',')[0]
    }
  }


}
