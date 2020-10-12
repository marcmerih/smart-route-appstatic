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
  @Input() hasBeenClicked: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  get isActive() {
    return (this.hasBeenClicked) ? 'col-md-12 col-sm-12 col-xs-12 tag-active' : 'col-md-12 col-sm-12 col-xs-12 tag';
  }

}
