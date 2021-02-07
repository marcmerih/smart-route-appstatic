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

  isExpanded = false;
  

  constructor() { }

  ngOnInit(): void {
    if (this.startingLocation.includes(',')) {
      this.startingLocation = this.startingLocation.split(',')[0]
    }
  }

  toggleExpansion(item) {
    item.isExpanded = !item.isExpanded;
  }

  amenities(item) {
    if (item.amenities.length > 3) {
      return item.amenities.slice(0, 3);
    }
    return item.amenities;
  }

  lockItem(item) {
    item.isLocked = !item.isLocked;
    // make backend call to show that item has been locked / unlocked;
  }

}
