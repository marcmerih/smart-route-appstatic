import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 
 
@Component({
 selector: 'app-header',
 templateUrl: './header.component.html',
 styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
 is_menu_displayed = false;
 
 constructor(private router: Router ) {}
 
 ngOnInit(): void {
 }
 toggle_menu_display() {
   this.is_menu_displayed = !this.is_menu_displayed ;
 }
 navigate_to_accounts() {
   this.router.navigateByUrl('/accounts');
 }
}
