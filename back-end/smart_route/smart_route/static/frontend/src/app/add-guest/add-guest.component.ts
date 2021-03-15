import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountsComponent, User } from '../accounts/accounts.component';
import { UserService } from '../accounts/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';''
export interface UserNameObject {
  username: string;
}
@Component({
  selector: 'app-add-guest',
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss']
})
export class AddGuestComponent implements OnInit {

  addGuestToTripForm: FormGroup;
  userDNE = false;

  constructor(private router: Router, private dialogRef: MatDialogRef<AddGuestComponent>, private userService: UserService) {
    this.addGuestToTripForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  addGuest(loginForm: FormGroup) {
    if (loginForm.valid) {
      const userObject: User = {
        username: loginForm.get('username').value,
        password: loginForm.get('password').value
      }
      this.userService.addGuestToTrip(userObject).subscribe((username: UserNameObject) => {
        console.log(username.username);
        this.userService.usersInTrip.push(username.username.toString()[0]);
        this.userDNE = false;
        this.addGuestToTripForm.reset();
        this.close();
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
