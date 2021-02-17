import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from './user.service';

enum profileCreationSteps {
  signUp = 0,
  seedPreferences = 1,
}

export interface User {
  username: string;
  password: string;
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
  accountProgression = 0;
  // seedPreferences;

  seedPreferences = [
    // Restaurant
    { 
      img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', 
      tags: ['Asian', 'Buffet'],
      name: "Bjrog's Lobster & Fish",
      address: '1250 Bay Street, Toronto, Ontario',
      isExpanded: false,
      cuisineOptions: ['Vegan'],
      currentRate: 0,
      reviewsUrl: '',
      id: 'R123',
      type: 'res',
      lat: 'asd',
      lon: 'asd',
      isLocked: false,
      usersMatchPercentage: 0,
      tripAdvisorRating: 4.7
    },
    // TTD
    { 
      img: 'https://www.niemanlab.org/images/hollywood-sign.jpg', 
      tags: ['Parks', 'Nature', 'Wildlife'],
      name: 'Algonquin Reservation',
      address: '1234 Lake Oaowa, Ontario',
      isExpanded: false,
      currentRate: 0,
      reviewsUrl: '',
      id: 'T04',
      type: 'ttd',
      lat: 'asd',
      lon: 'asd',
      isLocked: false,
      usersMatchPercentage: 0,
      tripAdvisorRating: 4.1
    },
    // Hotel
    { 
      img: 'https://images.vailresorts.com/image/fetch/ar_4:3,c_scale,dpr_3.0,f_auto,q_auto,w_400/https://images.vrinntopia.com/photos/854813/854813-123.jpg', 
      amenities: ['Free Breakfast', 'Free Wi-fi', 'Pool'], 
      isExpanded: false,
      name: 'Best Western Kawartha',
      address: '1234 Kawartha Lakes Drive, Ontario',
      currentRate: 0,
      reviewsUrl: '',
      id: 'H64',
      lat: 'asd',
      lon: 'asd',
      type: 'hotel',
      isLocked: false,
      usersMatchPercentage: 0,
      tripAdvisorRating: 3.9
    },
  ];

  constructor(private router: Router, private dialogRef: MatDialogRef<AccountsComponent>, private userService: UserService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      agreedToTerms: new FormControl(false, Validators.requiredTrue),
    });
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
      this.incrementRoute();
      this.userService.createAccount(userObject).subscribe(preferences => {
        this.signupForm.reset();
        // this.seedPreferences = preferences;
        this.incrementRoute();
      })
    }
  }

  signIn(loginForm: FormGroup) {
    const userObject: User = {
      username: loginForm.get('username').value,
      password: loginForm.get('password').value
    }
    if (loginForm.valid) {
      this.userService.signIn(userObject).subscribe(() => {
        this.loginForm.reset();
      });
    }
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
}
