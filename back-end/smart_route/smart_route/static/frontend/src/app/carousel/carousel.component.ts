import { Component, OnInit, Input } from '@angular/core';
import { TripService } from '../trip.service';
import { UserService } from '../accounts/user.service';

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
  

  constructor(private tripService: TripService, private userService: UserService) { }

  ngOnInit(): void {
    if (this.startingLocation.includes(',')) {
      this.startingLocation = this.startingLocation.split(',')[0]
    }
  }

  toggleExpansion(item) {
    item.isExpanded = Math.abs(item.isExpanded-1);
  }

  lockItem(item) {
    item.isLocked = Math.abs(item.isLocked-1);
    if (item.isLocked === 1) {
      this.tripService.lockPOI(item).subscribe(res => {
        console.log(res);
      });
    } else {
      this.tripService.unlockPOI(item).subscribe(res => {
        console.log(res);
      });
    }
    // make backend call to show that item has been locked / unlocked;
  }

  updateRating(item) {
    console.log(item);
    this.tripService.updateRating(item).subscribe(res => {
      console.log("success" + res);
    });
  }

  isRestaurant(item) {
    return (item.type === 'R');
  }

  getColour(i) {
    const colours = ['material-icons orange', 'material-icons green', 'material-icons teal', 'material-icons blue', 
      'material-icons purple', 'material-icons pink'];
    return colours[i];
  }

  get numberOfUsersInTrip() {
    return (this.userService.usersInTrip.length > 1);
  }

}
