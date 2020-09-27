import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @Input() tagName: string;
  @Input() icon: string;
  @Input() color: string;

  constructor() { }

  ngOnInit(): void {
  }

}
