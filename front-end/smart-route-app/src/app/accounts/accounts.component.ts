import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accountType = 'Sign Up';
  loginForm: FormGroup;
  signupForm: FormGroup;
  subscription: Subscription = new Subscription();
  accountProgression = 0

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      agreedToTerms: new FormControl(false, Validators.requiredTrue)
    })
  }

  ngOnInit(): void {
    // this.subscription.add(this.loginForm.get('email').value);
  }

  submitForm(formGroup: FormGroup) {
    if (formGroup.valid) {
      console.log(formGroup);
      // Make call to backend to save formgroup in db.
    }
  }
}
