import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { UserService } from '../accounts/user.service';
import { TripService } from '../trip.service';

@Component({
  selector: 'app-user-match',
  templateUrl: './user-match.component.html',
  styleUrls: ['./user-match.component.scss']
})
export class UserMatchComponent implements OnInit {
  usersInTrip: string[] = [];

  @Input() percentageMatch;

  constructor(private tripService: TripService) {
    this.usersInTrip = this.tripService.usersInTrip;
  }

  ngOnInit(): void {
  }

}
