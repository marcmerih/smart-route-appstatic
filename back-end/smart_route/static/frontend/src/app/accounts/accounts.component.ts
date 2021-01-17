import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from './user.service';

enum profileCreationSteps {
  signUp = 0,
  profileDetails = 1,
  interestSelection = 2
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
  accountProgression = 0

  constructor(private router: Router, private dialogRef: MatDialogRef<AccountsComponent>, private userService: UserService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      agreedToTerms: new FormControl(false, Validators.requiredTrue),
    })
    this.profileForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required)
    })
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.decrementRoute();
    console.log('Back button pressed');
  }

  ngOnInit(): void {
  }

  submitForm(formGroup: FormGroup) {
    if (formGroup.valid) {
      if (this.accountType === 'Sign Up') {
        this.currentProfileStep += 1;
        this.router.navigateByUrl('/accounts/profile-creation');
      }
      const userObject: User = {
        username: formGroup.get('username').value,
        password: formGroup.get('password').value  
      }
      this.userService.createAccount(userObject).subscribe(() => {
        this.signupForm.reset();
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
