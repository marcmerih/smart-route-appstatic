import { Component, AfterViewInit } from '@angular/core';
import {} from '../../../node_modules/ol'
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';

import {VectorImage} from 'ol/layer';
import {Vector} from 'ol/source';
import {Stroke} from 'ol/style';
import {Style} from 'ol/style';
import {GeoJSON} from 'ol/format';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { TripService } from '../trip.service';
@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements AfterViewInit {
  map: Map;

  constructor(private tripService: TripService) { }

  ngAfterViewInit() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      controls: [],
      view: new View({
        center: fromLonLat([-79.3872, 43.6352]),
        zoom: 7
      }),
    });

    // if (this.tripService.listOfNodes) {
      // const currentRoute = '{ "listOfNodes":' + this.tripService.listOfNodes + '}';

      // const nodesObject = JSON.parse(currentRoute);
      // console.log(nodesObject);


      // const strokeStyle = new Stroke({
      //   color: [146, 45, 45, 1],
      //   width: 15
      // })
  
      // const routedTripLayer = new VectorImage({
      //   source: new Vector({
      //     object: nodesObject,
      //     format: new GeoJSON()
      //   }),
      //   visible: true,
      //   title: 'route',
      //   style: new Style({
      //     stroke: strokeStyle
      //   })
      // })
  
      // this.map.addLayer(routedTripLayer);
    // }
  }

}
