import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from './user.service';
import { TripService } from '../trip.service';

enum profileCreationSteps {
  signUp = 0,
  seedPreferences = 1,
}

export interface User {
  username: string;
  password: string;
}

export interface UserNameObject {
  username: string;
}
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  createProfileSteps = profileCreationSteps;
  currentProfileStep = profileCreationSteps.signUp;
  accountType = 'Sign Up';
  loginForm: FormGroup;
  signupForm: FormGroup;
  profileForm: FormGroup;
  subscription: Subscription = new Subscription();
  accountProgression;
  seedPreferences;

  constructor(private router: Router, private dialogRef: MatDialogRef<AccountsComponent>, private userService: UserService, private tripService: TripService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      agreedToTerms: new FormControl(false, Validators.requiredTrue),
    });

    this.accountProgression = 0;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.decrementRoute();
    console.log('Back button pressed');
  }

  ngOnInit(): void {
  }

  submitForm(formGroup: FormGroup) { // Sign Up
    if (formGroup.valid) {
      const userObject: User = {
        username: formGroup.get('username').value,
        password: formGroup.get('password').value  
      }
      this.userService.createAccount(userObject).subscribe(preferences => {
        this.setUserSession(userObject.username);
        this.signupForm.reset();
        console.log(preferences);
        this.incrementRoute();
        this.seedPreferences = preferences;
      });
    }
  }

  signIn(loginForm: FormGroup) {
    if (loginForm.valid) {
      const userObject: User = {
        username: loginForm.get('username').value,
        password: loginForm.get('password').value
      }  
      this.userService.signIn(userObject).subscribe((username: UserNameObject) => {
        console.log(username.username);
        this.setUserSession(username.username);
        this.close();
        this.loginForm.reset();
      });
    }
  }

  setUserSession(username) {
    this.userService.username = username[0];
    this.userService.userSignedIn = true;
    this.userService.usersInTrip.push(username[0]);
    this.userService.userSignedInEmitter$.emit(true);
    this.userService.usersInTripEmitter$.emit(this.userService.usersInTrip);
  }

  incrementRoute() {
    this.currentProfileStep += 1;
  }

  decrementRoute() {
    if (this.currentProfileStep >= 0) {
      this.currentProfileStep -= 1;
    }
  }

  close() {
    this.dialogRef.close();
  }

  updateRating(item) {
    this.accountProgression += 1;
    this.tripService.updateRating(item).subscribe(res => {
      console.log(res);
    });
  }

  get seedPreferencesDoneButtonDisabled() {
    return (this.accountProgression <= 8);
  }
}
