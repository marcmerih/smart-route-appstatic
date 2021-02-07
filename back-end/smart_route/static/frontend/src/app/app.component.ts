import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoaderService } from './loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'smart-route-app';
  funFact = [
    'Ontario covers one million square kilometres!',
    'Boasting approximately 250,000 lakes, Ontario is estimated to have 20% of the world’s freshwater stores!',
    'Jewelry lovers will recognize the official stone of Ontario — amethyst — as the stunning semi-precious purple stone found in rings, necklaces, and earrings!',
    'Niagara Falls remains one of the biggest draws to the province, as well as one of the most popular tourist attractions in North America!',
    'The official flower of Ontario is the trillium. The beautiful, white three-petaled flower can be found growing wild in spring!',
    'Ontario is the second-largest province in Canada, coming in behind Quebec!',
    'Popular actors from Toronto include Christopher Plummer, Will Arnet, Mike Myers, and Rick Moranis!'
  ];
  showedFact: string;

  constructor(public router: Router, private breakpointbserver: BreakpointObserver, public loaderService: LoaderService) {
    // TO-DO: @MARC ATASOY - change later.
    this.router.navigateByUrl('route/');
  }

  ngAfterViewInit() {
    let randomIndex = Math.floor(Math.random() * this.funFact.length);
    this.showedFact = this.funFact[randomIndex];
  }

}
