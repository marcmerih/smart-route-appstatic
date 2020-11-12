import { Component, AfterViewInit } from '@angular/core';
import {} from '../../../node_modules/ol'
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';

import {VectorImage} from 'ol/layer';

import SourceVector from 'ol/source/vector';
import LayerVector from 'ol/layer/vector';

import {Feature} from 'ol';
import {Point, LineString} from 'ol/geom';

import GeoJSON from 'ol/format/GeoJSON';

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
  listOfNodes;

  constructor(private tripService: TripService) {
  }

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

    this.tripService.nodes$.subscribe(listOfNodes => this.onListOfNodesReturned(listOfNodes));
  }

  onListOfNodesReturned(nodes) {
    // Get the GeoJSON format of nodes
    this.listOfNodes = nodes;
    const nodesObject = JSON.parse(this.listOfNodes);

    // Get the starting and ending locations as markers on the map.
    this.setStartEndMarkers(nodesObject);

    // Route the starting to ending location on map.
    this.routePath(nodesObject);
  }

  setStartEndMarkers(nodesObject) {
    const coordinates = nodesObject['features'][0]['geometry']['coordinates'];

    const startingCoordinates = coordinates[0];
    const endingCoordinates = coordinates[coordinates.length - 1];

    const startingLocationMarker = new LayerVector({
      source: new SourceVector({
        features: [
            new Feature({
                geometry: new Point(fromLonLat(startingCoordinates))
            })
        ]
      })
    });

    this.map.addLayer(startingLocationMarker);

    const endingLocationMarker = new LayerVector({
      source: new SourceVector({
        features: [
            new Feature({
                geometry: new Point(fromLonLat(endingCoordinates))
            })
        ]
      })
    });

    this.map.addLayer(endingLocationMarker);
  }

  routePath(nodesObject) {
    var route = new Feature();
    var coordinates = nodesObject['features'][0]['geometry']['coordinates'];
    var geometry = new LineString(coordinates);
    geometry.transform('EPSG:4326', 'EPSG:3857'); //Transform to your map projection
    route.setGeometry(geometry);

    const vectorLayer = new LayerVector({
      source: new SourceVector({
        format: new GeoJSON()
      })
    });

    vectorLayer.getSource().addFeature(route);
    this.map.addLayer(vectorLayer);
  }
}
