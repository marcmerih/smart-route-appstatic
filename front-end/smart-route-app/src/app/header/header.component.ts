import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { AccountsComponent } from '../accounts/accounts.component';
 
 
@Component({
 selector: 'app-header',
 templateUrl: './header.component.html',
 styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
 userSignedIn = false;
 isTripOverlayExpanded = true;

 constructor(private router: Router, private dialog: MatDialog) {}
 
 ngOnInit(): void {
 }

 openSignUp() {
  let dialogRef = this.dialog.open(AccountsComponent, {
    height: '70vh',
    width: '70vw'
  });
 }

 toggleTripOverlay() {
   this.isTripOverlayExpanded = !this.isTripOverlayExpanded;
 }

 get tripOverlayExpand() {
   return (this.isTripOverlayExpanded) ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
 }
}
