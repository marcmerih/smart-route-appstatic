import { Component, AfterViewInit } from '@angular/core';
import {  } from '../../../node_modules/ol'
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import ZoomToExtent from 'ol/control/ZoomToExtent';
@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements AfterViewInit {
  map: Map;

  constructor() { }

  ngAfterViewInit() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([-79.3872, 43.6352]),
        zoom: 7
      }),
    });

    this
  }

}
