import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smart-route-app';

  constructor(public router: Router) {
    // TO-DO: @MARC ATASOY - change later.
    this.router.navigateByUrl('accounts');
  }
}
