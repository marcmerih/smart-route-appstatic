import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TripService } from '../trip.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  currentLabel: string = 'add';
  @Input() poi;
  @Input() name: string;
  @Input() address: string;
  @Input() rating: string;
  @Input() recommendationReason: string = "Because of your interest in Asian Restaurants";
  @Input() tags: string[] = ['Asian', 'Barbecue', 'Buffet'];

  @Output() poiAdded = new EventEmitter();
  @Output() poiLiked = new EventEmitter();
  @Output() poiDisliked = new EventEmitter();

  constructor(public tripService: TripService) { }

  ngOnInit(): void {
  }

  onPoiLiked($event) {
    this.poiLiked.emit(this.poi);
  }

  onPoiDisliked($event) {
    this.poiDisliked.emit(this.poi);
  }

  onPoiAdded($event) {
    const obj = {
      poi: this.poi,
      currentLabel: this.currentLabel
    }
    this.poiAdded.emit(obj);
    this.changeCurrentLabel(this.currentLabel);
  }

  get currentRoute() {
    return this.tripService.currentRoute.stops;
  }

  changeCurrentLabel(currentLabel) {
    if (currentLabel === 'add') {
      this.currentLabel = 'remove';
    } else {
      this.currentLabel = 'add'
    }
  }

}
