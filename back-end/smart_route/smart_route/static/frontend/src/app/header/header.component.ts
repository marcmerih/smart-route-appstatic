import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { AccountsComponent } from '../accounts/accounts.component';
import { UserService } from '../accounts/user.service';
import { AddGuestComponent } from '../add-guest/add-guest.component';
 
 
@Component({
 selector: 'app-header',
 templateUrl: './header.component.html',
 styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
 userSignedIn = true;
 isTripOverlayExpanded = true;

 constructor(private router: Router, private dialog: MatDialog, public userService: UserService) {}
 
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

 addGuest() {
  let dialogRef = this.dialog.open(AddGuestComponent, {
    height: '50vh',
    width: '50vw'
  });
 }

 get tripOverlayExpand() {
   return (this.isTripOverlayExpanded) ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
 }
}
