import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './accounts.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userSignedIn = false;
  username: string;
  usersInTrip: string[] = [];
  public usersInTripEmitter$: EventEmitter<string[]>;
  public userSignedInEmitter$: EventEmitter<boolean>;

  constructor(private http: HttpClient) {
    this.userSignedInEmitter$ = new EventEmitter();
    this.usersInTripEmitter$ = new EventEmitter();
  }

  signIn(userObject: User) {
    return this.http.get(`./signIn/${userObject.username}-${userObject.password}`);
  }

  createAccount(userObject: User) {
    return this.http.get(`./createUser/${userObject.username}-${userObject.password}`);
  }
  
  addGuestToTrip(userObject: User) {
    return this.http.get(`./addGuest/${userObject.username}-${userObject.password}`)
  }
}
