import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
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
export class HeaderComponent implements OnInit, AfterViewInit {
 isTripOverlayExpanded = true;
 userSignedIn = false;
 usersInTrip: string[] = [];

 constructor(private router: Router, private dialog: MatDialog, public userService: UserService) {
 }
 
 ngOnInit(): void {
 }

 ngAfterViewInit(): void {
  this.userService.userSignedInEmitter$.subscribe(userSignedIn => this.setUserSignedIn(userSignedIn));
  this.userService.usersInTripEmitter$.subscribe(usersInTrip => this.setUsersInTrip(usersInTrip));
 }

 openSignUp() {
  let dialogRef = this.dialog.open(AccountsComponent, {
    maxWidth: '100vw',
    maxHeight: '100vh',
    height: '100%',
    width: '100%'
  });
 }

 setUserSignedIn(userSignedIn) {
   this.userSignedIn = userSignedIn;
 }

 setUsersInTrip(usersInTrip) {
   this.usersInTrip = usersInTrip;
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
