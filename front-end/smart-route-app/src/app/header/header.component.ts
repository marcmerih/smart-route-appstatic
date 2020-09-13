import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  is_menu_displayed = false;

  constructor() { }

  ngOnInit(): void {
  }
  toggle_menu_display() {
    this.is_menu_displayed = !this.is_menu_displayed ;
  }


}
