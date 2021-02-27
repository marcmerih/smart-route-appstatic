import { Component, OnInit, Input } from '@angular/core';
import { TripService } from '../trip.service';

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
  

  constructor(private tripService: TripService) { }

  ngOnInit(): void {
    if (this.startingLocation.includes(',')) {
      this.startingLocation = this.startingLocation.split(',')[0]
    }
  }

  toggleExpansion(item) {
    item.isExpanded = Math.abs(item.isExpanded-1);
  }

  amenities(item) {
    if (item.amenities.length > 3) {
      return item.amenities.slice(0, 3);
    }
    return item.amenities;
  }

  lockItem(item) {
    item.isLocked = Math.abs(item.isLocked-1);
    if (item.isLocked === 1) {
      this.tripService.lockPOI(item);
    } else {
      this.tripService.unlockPOI(item);
    }
    // make backend call to show that item has been locked / unlocked;
  }

  updateRating(item) {
    console.log(item);
    this.tripService.updateRating(item);
  }

  restaurantTags(item) {
    return JSON.parse(item.resTags);
  }

  isRestaurant(item) {
    return (item.type === 'R');
  }

}
