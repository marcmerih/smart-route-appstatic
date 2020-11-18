import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddIntermediateStopComponent } from '../add-intermediate-stop/add-intermediate-stop.component';
import { TripService } from '../trip.service';
import { FormGroup } from '@angular/forms';
import { TripSettingsComponent } from '../trip-settings/trip-settings.component';
import { HttpClient } from '@angular/common/http';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { RoutesComponent } from '../routes/routes.component';
import { RoutingSteps, TripSettings, RouteModel, RestaurantsModel } from '../models';

@Component({
  selector: 'app-trip-overlay',
  templateUrl: './trip-overlay.component.html',
  styleUrls: ['./trip-overlay.component.scss']
})
export class TripOverlayComponent implements OnInit {
  hasBeenRouted = false;
  routingSteps: any = RoutingSteps;
  currentStep: RoutingSteps = RoutingSteps.routeStartEnd;
  startTripForm: FormGroup;
  intermediateLocationAddress = '';
  addresses = [];
  currentRoute: any;
  restaurantClicked = false;
  hotelsClicked = false;
  ttdClicked = false;
  tripSettings: TripSettings = new TripSettings;
  restaurants: RestaurantsModel;
  mockRestaurants = `[[432,
    "Prime's Steakhouse Niagara Falls",
    "5685 Falls Avenue, Niagara Falls, Ontario L2E 6W7 Canada",
    4.8,
    43.09269115,
    -79.07169652],
   [924,
    "Est Restaurant",
    "729 Queen St E, Toronto, Ontario M4M 1H1 Canada",
    4.8,
    43.65893534,
    -79.3489562],
   [256,
    "lo Prestis at Maxwells",
    "Jackson st.e, Hamilton, Ontario Canada",
    4.7,
    43.2543027,
    -79.86933370000001],
   [434,
    "Tide and Vine Oyster House",
    "3491 Portage Rd, Niagara Falls, Ontario L2J 2K5 Canada",
    4.7,
    43.1215245,
    -79.09977664],
   [868,
    "Beechwood Doughnuts",
    "165 St. Paul Street, St. Catharines, Ontario L2R 3M5 Canada",
    4.7,
    43.15773514,
    -79.24467442],
   [417,
    "LaVinia Restaurant",
    "2350 Lake Shore Blvd W, Toronto, Ontario M8V 1B6 Canada",
    4.7,
    43.6163386,
    -79.48815040000001],
   [815,
    "Terrys Cut Steakhouse",
    "300 Fourth Avenue, St. Catharines, Ontario L2R 6P9 Canada",
    4.7,
    43.154726700000005,
    -79.2976017],
   [802,
    "The Diner House 29",
    "431 Welland Ave, St. Catharines, Ontario L2M 5V2 Canada",
    4.7,
    43.1732717,
    -79.219686],
   [867,
    "Pho 18",
    "18 Clairmont St, Thorold, Ontario L2V 1R1 Canada",
    4.7,
    43.1236181,
    -79.197716],
   [438,
    "Buried Treasure Cafe",
    "8053 Portage Rd, Niagara Falls, Ontario L2G 5Z2 Canada",
    4.7,
    43.0602291,
    -79.05361321],
   [930,
    "ALO RESTAURANT",
    "163 Spadina Ave 3rd Floor, Toronto, Ontario M5V 2L6 Canada",
    4.7,
    43.65238435,
    -79.38356765],
   [926,
    "New Orleans Seafood & Steakhouse",
    "267 Scarlett Rd York, Toronto, Ontario M6N 4L1 Canada",
    4.7,
    43.6777641,
    -79.50613779],
   [136,
    "sushi Masayuki",
    "2180 Itabashi Way, Burlington, Ontario L7M 5A5 Canada",
    4.7,
    43.38709,
    -79.79491440000001],
   [928,
    "The Tilted Dog Pub & Kitchen",
    "424 Parliament St, Toronto, Ontario M5A 3A2 Canada",
    4.7,
    43.66291795,
    -79.36760388],
   [433,
    "AG Inspired Cuisine",
    "5195 Magdalen St, Niagara Falls, Ontario L2G 3S6 Canada",
    4.7,
    43.091603000000006,
    -79.080458],
   [441,
    "scoops Restaurant",
    "8123 Lundys Lane, Niagara Falls, Ontario L2H 1H3 Canada",
    4.6,
    43.0890201,
    -79.13419350000001],
   [804,
    "Rise Above",
    "120 St. Paul St, St. Catharines, Ontario L2R 3M2 Canada",
    4.6,
    43.15717029,
    -79.24492621],
   [946,
    "stelvio",
    "791 Dundas St W, Toronto, Ontario M6J 1V2 Canada",
    4.6,
    43.651798600000006,
    -79.40779098],
   [864,
    "The Karma Kameleon Gastropub",
    "1 Front St N, Thorold, Ontario L2V 1X3 Canada",
    4.6,
    43.1251247,
    -79.20084150000001],
   [443,
    "Turtle Jacks Niagara Falls",
    "6733 Fallsview Blvd, Niagara Falls, Ontario L2G 3W7 Canada",
    4.6,
    43.07774333,
    -79.08234454],
   [934,
    "Richmond Station",
    "1 Richmond St. West, Toronto, Ontario M5H 3W4 Canada",
    4.6,
    43.651383700000004,
    -79.3789722],
   [938,
    "Madrina Bar Y Tapas",
    "2 Trinity St, Toronto, Ontario M5A 3C4 Canada",
    4.6,
    43.6522057,
    -79.3604021],
   [937,
    "Jacques Bistro Du Parc",
    "126 Cumberland St, Toronto, Ontario M5R 1A6 Canada",
    4.6,
    43.6701792,
    -79.3920963],
   [142,
    "Olive Us Greek Restaurant",
    "421 Guelph Line, Burlington, Ontario L7R 3L7 Canada",
    4.6,
    43.338038,
    -79.7846065],
   [125,
    "Downtown Bistro & Grill",
    "441 Elizabeth St, Burlington, Ontario L7R 2L8 Canada",
    4.6,
    43.32663275,
    -79.79653354],
   [126,
    "Mythos Greek Cuisine Winebar",
    "3500 Fairview Street, Burlington, Ontario L7N 2R5 Canada",
    4.6,
    43.3596136,
    -79.7794578],
   [123,
    "Kellys Bake Shoppe",
    "401 Brant St, Burlington, Ontario L7R 2E9 Canada",
    4.6,
    43.3258125,
    -79.79775090000001],
   [803,
    "Wellington Court Restaurant + Catering",
    "11 Wellington St, St. Catharines, Ontario L2R 5P5 Canada",
    4.6,
    43.159534,
    -79.24911970000001],
   [122,
    "Amaya Express",
    "489 Brant St, Burlington, Ontario L7R 2G5 Canada",
    4.6,
    43.3274295,
    -79.80016377],
   [237,
    "Berkeley North Restaurant",
    "31 King William St, Hamilton, Ontario L8R 1A1 Canada",
    4.6,
    43.25740347,
    -79.86769518],
   [436,
    "The Blue Line",
    "4424 Montrose Rd, Niagara Falls, Ontario L2H 1K2 Canada",
    4.6,
    43.10882688,
    -79.12413667],
   [416,
    "Luci Restaurant",
    "664 The Queensway, Toronto, Ontario M8Y 1K7 Canada",
    4.6,
    43.62744144,
    -79.49821766],
   [411,
    "Piatto Bistro",
    "1646 Dundas St W, Mississauga, Ontario L5C 1E6 Canada",
    4.6,
    43.544237700000004,
    -79.6548867],
   [437,
    "Pho Xyclo",
    "6175 Dunn St, Niagara Falls, Ontario L2G 2P4 Canada",
    4.6,
    43.07888504,
    -79.09572017],
   [925,
    "scaramouche Restaurant",
    "1 Benvenuto Pl, Toronto, Ontario M4V 2L1 Canada",
    4.6,
    43.682243400000004,
    -79.4003675],
   [435,
    "The Moose and Pepper Bistro",
    "4740 Valley Way, Niagara Falls, Ontario L2E 1W1 Canada",
    4.6,
    43.10603588,
    -79.07213377],
   [931,
    "Pai Northern Thai Kitchen",
    "18 Duncan St, Toronto, Ontario M5H 3G8 Canada",
    4.6,
    43.6478355,
    -79.38871400000001],
   [933,
    "Antler Kitchen and Bar",
    "1454 Dundas St W, Toronto, Ontario M6J 1Y6 Canada",
    4.6,
    43.649716999999995,
    -79.43055759999999],
   [238,
    "The Ship",
    "23 Augusta St, Hamilton, Ontario L8N 1P6 Canada",
    4.5,
    43.2521101,
    -79.87002890000001],
   [242,
    "Brux House",
    "137 Locke St S, Hamilton, Ontario L8P 4A7 Canada",
    4.5,
    43.2565599,
    -79.88497480000001],
   [239,
    "Charred Rotisserie House",
    "244 James St N, Hamilton, Ontario L8R 2L3 Canada",
    4.5,
    43.26274828,
    -79.8661995],
   [944,
    "Cafe Polonez",
    "195 Roncesvalles Ave, Toronto, Ontario M6R 2L5 Canada",
    4.5,
    43.6451197,
    -79.4484135],
   [935,
    "Jacobs & Co. Steakhouse",
    "12 Brant St, Toronto, Ontario M5V 2M1 Canada",
    4.5,
    43.6454066,
    -79.3981498],
   [254,
    "Marcianos Pasta Cafe",
    "5 Mill Street South, Hamilton, Ontario L0R 2H0 Canada",
    4.5,
    43.33426268,
    -79.89131748],
   [945,
    "Adega",
    "33 Elm St, Toronto, Ontario M5G 1H1 Canada",
    4.5,
    43.6573005,
    -79.38357309999999],
   [941,
    "GEORGE Restaurant",
    "111 Queen St E, Toronto, Ontario M5C 1S2 Canada",
    4.5,
    43.653361100000005,
    -79.3743382],
   [947,
    "Chiado Restaurant",
    "864 College St, Toronto, Ontario M6H 1A3 Canada",
    4.5,
    43.6541835,
    -79.42424229999999],
   [414,
    "Clarkson Mediterranean Bistro",
    "1731 Lakeshore Rd W, Mississauga, Ontario L5J 1J4 Canada",
    4.5,
    43.5177573,
    -79.6228934],
   [127,
    "Club 54",
    "3345 Harvester Rd, Burlington, Ontario L7N 3N2 Canada",
    4.5,
    43.35838786,
    -79.79127857],
   [124,
    "Rayhoon Persian Eatery",
    "420 Pearl St, Burlington, Ontario L7R 2N1 Canada",
    4.5,
    43.3265814,
    -79.79530105],
   [418,
    "Raw Aura Organic Cuisine",
    "94 Lakeshore Rd E, Mississauga, Ontario L5G 1E3 Canada",
    4.5,
    43.5533693,
    -79.58403220000001],
   [131,
    "Pane Fresco Artisan Breads & Cafe",
    "414 Locust St, Burlington, Ontario L7S 1T7 Canada",
    4.5,
    43.3241745,
    -79.7977419],
   [444,
    "Paris Crepes Cafe",
    "4613 Queen St, Niagara Falls, Ontario L2E 2L7 Canada",
    4.5,
    43.10678618,
    -79.06965908],
   [939,
    "Michaels on Simcoe",
    "100 Simcoe St, Toronto, Ontario M5H 3G2 Canada",
    4.5,
    43.648505,
    -79.386687],
   [426,
    "Goodfellas Wood Oven Pizza",
    "1 Old Mill Dr, Toronto, Ontario M6S 0A1 Canada",
    4.5,
    43.64838885,
    -79.48638223],
   [940,
    "EVOO Ristorante",
    "138 Avenue Rd, Toronto, Ontario M5R 2H6 Canada",
    4.5,
    43.6744557,
    -79.3967031],
   [807,
    "The Merchant Ale House",
    "98 St. Paul St, St. Catharines, Ontario L2R 3M2 Canada",
    4.5,
    43.1568578,
    -79.245092],
   [806,
    "Rozies Breakfast Cafe",
    "25 Main St Port Dalhousie, St. Catharines, Ontario L2N 4T6 Canada",
    4.5,
    43.2014423,
    -79.2684043],
   [805,
    "Ma Chinese's Cuisine",
    "123 Geneva St, St. Catharines, Ontario L2R 4N3 Canada",
    4.5,
    43.1669315,
    -79.24054179999999],
   [427,
    "Andiamo Pasta Plus",
    "135 Queen St S, Mississauga, Ontario L5M 1K9 Canada",
    4.5,
    43.583303799999996,
    -79.71573240000001],
   [445,
    "Casa Mia Ristorante",
    "3518 Portage Rd, Niagara Falls, Ontario L2J 2K4 Canada",
    4.5,
    43.1223001,
    -79.0992492]]`;


  constructor(private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute,
    private tripService: TripService, private http: HttpClient) {
    this.startTripForm = this.tripService.tripSetupForm;
    this.tripSettings.maximumDetourDuration = 100;
    this.restaurants = new RestaurantsModel();
  }

  ngOnInit(): void {
    this.restaurants = JSON.parse(this.mockRestaurants);
    console.log(this.restaurants);
  }

  route() {
    const queryParams: Params = { startingLocation: this.startingLocation, 
      endingLocation: this.endingLocation,
      maximumDetour: this.tripSettings.maximumDetourDuration  
    };
    this.router.navigate(
      [], 
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams, 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });

    this.hasBeenRouted = true;
    this.currentStep = this.routingSteps.tripDetails;
    this.http.get(`./dir/${this.startingLocation}-${this.endingLocation}-${this.tripSettings.maximumDetourDuration}`).subscribe((request: RouteModel) => {
      // send list of addresses to backend as well. If addresses.length == 2, then just do Route(starting, ending), if length > 2, go through
      // list of addresses and route between each 2 locations, append all list of nodes (ensuring there is no overlap), and return that list (this is for intermediate addresses and POIs)
      // console.log(request);
      // console.log(typeof(request));
      this.currentRoute = JSON.parse(request.listOfNodes)
      // console.log(this.currentRoute);
      // console.log(typeof(this.currentRoute));
      this.tripService.setListOfNodes(this.currentRoute);
    });

    // Things required to do:
    //  1) Transform current route into list of arrays from list of tuples.
    //  2) Set current route equal to a service variable (in trip service) that is accessible globally
    //  3) In routes.component.ts, process the variable as a vectorlayer, and add that layer onto the map.
  }

  openTripSettings() {
    let dialogRefSettings = this.dialog.open(TripSettingsComponent, {
      height: '60vh',
      width: '60vw'
    });

    dialogRefSettings.afterClosed().subscribe(result => {
      this.tripSettings.maximumDetourDuration = result;
    });
  }

  addIntermediaryAddress() {
    let dialogRef = this.dialog.open(AddIntermediateStopComponent, {
      height: '40vh',
      width: '40vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      // Make a backend call to update route with added stop.
      if (result) {
        this.addresses.push(result.value);
        this.intermediateLocationAddress = result.value;
        let joinedAddress = this.addresses.join(',');

        const queryParams: Params = { 
          startingLocation: this.startingLocation, 
          endingLocation: this.endingLocation,
          intermediateLocation: joinedAddress
         };
        this.router.navigate(
          [], 
          {
            relativeTo: this.activatedRoute,
            queryParams: queryParams, 
            queryParamsHandling: 'merge', // remove to replace all query params by provided
          });
    
        this.hasBeenRouted = true;
        this.currentStep = this.routingSteps.tripDetails;
        this.http.get<RouteModel>(`./intermediate/${this.startingLocation}-${this.endingLocation}-${this.tripSettings.maximumDetourDuration}-${this.addresses}`).subscribe(request => {
          // send list of addresses to backend as well. If addresses.length == 2, then just do Route(starting, ending), if length > 2, go through
          // list of addresses and route between each 2 locations, append all list of nodes (ensuring there is no overlap), and return that list (this is for intermediate addresses and POIs)
          this.currentRoute = JSON.parse(request.listOfNodes);
        });

        this.tripService.setListOfNodes(this.currentRoute);
      }
    });
  }

  hasBeenClicked(tag: string) {
    if (tag === 'restaurant') {
      this.displayRestaurants();
    } else if (tag === 'hotels') {
      this.displayHotels();
    } else {
      this.displayTTD();
    }
  }

  displayRestaurants() {
    this.restaurantClicked = !this.restaurantClicked;
    if (this.restaurantClicked) {
      this.http.get('route/restaurant/').subscribe((request: RestaurantsModel) => {
        // this.restaurants.restaurantAddresses = JSON.parse(request.restaurantAddresses);
        // this.restaurants.restaurantLats = JSON.parse(request.restaurantLats);
        // this.restaurants.restaurantLons = JSON.parse(request.restaurantLons);
        // this.restaurants.restaurantNames = JSON.parse(request.restaurantNames);
        // this.restaurants.restaurantRatings = JSON.parse(request.restaurantRatings);
        console.log(this.restaurants);
      });
    }
  }

  displayHotels() {
    this.hotelsClicked = !this.hotelsClicked;
    // Add API call here.
  }

  displayTTD() {
    this.ttdClicked = !this.ttdClicked;
    // Add API call here;
  }

  get startingLocation() {
    return this.startTripForm.get('startingLocation').value;
  }

  get endingLocation() {
    return this.startTripForm.get('endingLocation').value;
  }

  get isRouteDisabled() {
    return !(this.startTripForm.get('startingLocation').value &&
      this.startTripForm.get('endingLocation').value)
  }

}
