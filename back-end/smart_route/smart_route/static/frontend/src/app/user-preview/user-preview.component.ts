import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { UserService } from '../accounts/user.service';

@Component({
  selector: 'app-user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss']
})
export class UserPreviewComponent implements OnInit {
  @Input() usersInTrip: string;
  colors = ['red', 'blue', 'green', 'gray'];

  constructor() {
  }

  ngOnInit(): void {
  }

  userName(user) {
    console.log(user);
    return user[0].toUpperCase();
  }

}
