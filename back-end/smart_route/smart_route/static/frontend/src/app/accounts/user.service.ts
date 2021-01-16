import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './accounts.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  signIn(userObject: User) {
    return this.http.get(`./signIn/${userObject.username}-${userObject.password}`);
  }

  createAccount(userObject: User) {
    return this.http.get(`./createUser/${userObject.username}-${userObject.password}`);
  }
}
