import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountsComponent, User } from '../accounts/accounts.component';
import { UserService } from '../accounts/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    const userObject: User = {
      username: loginForm.get('username').value,
      password: loginForm.get('password').value
    }
    if (loginForm.valid) {
      this.userService.addGuestToTrip(userObject).subscribe((username: string) => {
        if (username) {
          this.userService.usersInTrip.push(username);
          this.userDNE = false;
        } else {
          this.userDNE = true;
        }
        this.addGuestToTripForm.reset();
        this.close();
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
