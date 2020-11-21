import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() name: string;
  @Input() address: string;
  @Input() rating: string;
  @Input() recommendationReason: string = "Because of your interest in Asian Restaurants";
  @Input() tags: string[] = ['Asian', 'Barbecue', 'Buffet'];

  constructor() { }

  ngOnInit(): void {
  }

}
