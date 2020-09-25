import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
 
 
@Component({
 selector: 'app-header',
 templateUrl: './header.component.html',
 styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
 userSignedIn = false;
 isTripOverlayExpanded = true;

 constructor(private router: Router ) {}
 
 ngOnInit(): void {
 }

 toggleTripOverlay() {
   this.isTripOverlayExpanded = !this.isTripOverlayExpanded;
 }

 get tripOverlayExpand() {
   return (this.isTripOverlayExpanded) ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
 }
}
