import { Component, AfterViewInit, OnInit } from '@angular/core';
import {} from '../../../node_modules/ol'
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';

import {VectorImage} from 'ol/layer';
import {Stroke, Circle, Fill, Style} from 'ol/style';
import {transform} from 'ol/proj';

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
  basemap;
  layers;
  markers;
  addedPOIs;

  constructor(private tripService: TripService) {
    this.layers = [];
    this.markers = [];
    this.addedPOIs = []
  }

  ngAfterViewInit() {
    this.basemap = new TileLayer({ source: new OSM() })
    this.map = new Map({
      target: 'map',
      layers: [
        this.basemap
      ],
      controls: [],
      view: new View({
        center: fromLonLat([-79.3872, 43.6352]),
        zoom: 7
      }),
    });
    this.tripService.nodes$.subscribe(listOfNodes => this.onListOfNodesReturned(listOfNodes));
    this.tripService.poiMarkers$.subscribe(coords => this.setPOIMarkers(coords));
    this.tripService.resetMarkers$.subscribe(coords => this.resetMarkers());
  }

  onListOfNodesReturned(nodes) {
    // Get the starting and ending locations as markers on the map.
    this.setStartEndMarkers(nodes);

    // Route the starting to ending location on map.
    this.routePath(nodes);
  }

  setStartEndMarkers(nodes) {
    console.log(nodes);
    console.log(typeof(nodes));
    const startingCoordinates = nodes[0];
    const endingCoordinates = nodes[nodes.length - 1];

    const startingLocationMarker = new LayerVector({
      source: new SourceVector({
        features: [
          new Feature({
              geometry: new Point(fromLonLat(startingCoordinates))
          })
        ]
      }),
      style: new Style({
        fill: new Fill({
            color: 'rgba(255, 0, 0, 0.2)'
        }),
        image: new Circle({
            radius: 9,
            fill: new Fill({
                color: 'rgba(51,204,0,1)'
            }),
            stroke: new Stroke({
              color: 'white',
              width: 3
            }),
        })
      }),
      zIndex: 10000
    });

    this.map.addLayer(startingLocationMarker);

    const endingLocationMarker = new LayerVector({
      source: new SourceVector({
        features: [
          new Feature({
              geometry: new Point(fromLonLat(endingCoordinates))
          })
        ]
      }),
      style: new Style({
        fill: new Fill({
            color: 'rgba(255, 0, 0, 0.2)'
        }),
        image: new Circle({
            radius: 9,
            fill: new Fill({
                color: 'rgba(204,51,51,1)'
            }),
            stroke: new Stroke({
              color: 'white',
              width: 3
            }),
        })
      }),
      zIndex: 10000
    });

    this.map.addLayer(endingLocationMarker);
  }

  setPOIMarkers(coords) {
    this.resetMarkers();
    coords.forEach(coordinates => {
      const POIMarker = new LayerVector({
        source: new SourceVector({
          features: [
            new Feature({
                geometry: new Point(fromLonLat(coordinates))
            })
          ]
        }),
        style: new Style({
          fill: new Fill({
              color: 'rgba(255, 0, 0, 0.2)'
          }),
          image: new Circle({
              radius: 9,
              fill: new Fill({
                  color: 'rgba(22,120,242,1)'
              }),
              stroke: new Stroke({
                color: 'white',
                width: 3
              }),
          })
        }),
        zIndex: 10000
      });
      this.markers.push(POIMarker);
      this.map.addLayer(POIMarker);
    });
  }

  routePath(nodes) {
    this.resetRoute();
    var route = new Feature();
    var geometry = new LineString(nodes);
    geometry.transform('EPSG:4326', 'EPSG:3857'); //Transform to your map projection
    route.setGeometry(geometry);

    const vectorLayer = new LayerVector({
      source: new SourceVector({
        format: new GeoJSON()
      }),
      style: new Style({
        stroke: new Stroke({
          color: [41, 153, 228, 0.8],
          width: 6
        })
      })
    });

    vectorLayer.getSource().addFeature(route);
    this.map.addLayer(vectorLayer);
    this.layers.push(vectorLayer);
    
    // this.map.getView().setCenter(transform([nodes[nodes.length / 2][0], nodes[nodes.length / 2][1]], 'EPSG:4326', 'EPSG:3857'));
    // this.map.getView().setZoom(12);
  }

  resetMarkers() {
    this.markers.forEach(element => {
      this.map.removeLayer(element);
    });

    // this.layers.forEach(element => {
    //   this.map.removeLayer(element);
    // });
  }

  resetRoute() {
    this.layers.forEach(element => {
      this.map.removeLayer(element);
    });
  }

}
