import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddIntermediateStopComponent } from '../add-intermediate-stop/add-intermediate-stop.component';
import { TripService } from '../trip.service';
import { FormGroup } from '@angular/forms';
import { TripSettingsComponent } from '../trip-settings/trip-settings.component';
import { HttpClient } from '@angular/common/http';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { RoutesComponent } from '../routes/routes.component';
import { RoutingSteps, TripSettings, RouteModel } from '../models';

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

  constructor(private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute,
    private tripService: TripService, private http: HttpClient) {
    this.startTripForm = this.tripService.tripSetupForm;
    this.tripSettings.maximumDetourDuration = 100;
  }

  ngOnInit(): void {
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
    this.http.get<RouteModel>(`./dir/${this.startingLocation}-${this.endingLocation}-${this.tripSettings.maximumDetourDuration}`).subscribe(request => {
      // send list of addresses to backend as well. If addresses.length == 2, then just do Route(starting, ending), if length > 2, go through
      // list of addresses and route between each 2 locations, append all list of nodes (ensuring there is no overlap), and return that list (this is for intermediate addresses and POIs)
      this.currentRoute = JSON.parse(request.listOfNodes);
    });

    // Things required to do:
    //  1) Transform current route into list of arrays from list of tuples.
    //  2) Set current route equal to a service variable (in trip service) that is accessible globally
    //  3) In routes.component.ts, process the variable as a vectorlayer, and add that layer onto the map.
    const route = "[[-79.596217, 43.61336], [-79.596212, 43.613356], [-79.595312, 43.612949], [-79.594495, 43.612395], [-79.594335, 43.612317], [-79.593802, 43.612134], [-79.59373, 43.612131], [-79.593662, 43.612162], [-79.593278, 43.612601], [-79.593223, 43.612667], [-79.59312, 43.612613], [-79.593057, 43.612581], [-79.592701, 43.61243], [-79.592342, 43.612321], [-79.592249, 43.612295], [-79.592147, 43.61227], [-79.591616, 43.612152], [-79.591309, 43.612113], [-79.591208, 43.6121], [-79.591102, 43.612088], [-79.590664, 43.612054], [-79.590502, 43.612055], [-79.590397, 43.612066], [-79.590294, 43.612081], [-79.590169, 43.612107], [-79.589949, 43.612189], [-79.589737, 43.612295], [-79.589527, 43.612439], [-79.58936, 43.612579], [-79.589266, 43.612597], [-79.589059, 43.612754], [-79.589003, 43.612828], [-79.588866, 43.612731], [-79.587626, 43.611897], [-79.587304, 43.611668], [-79.587281, 43.611652], [-79.586617, 43.611145], [-79.586477, 43.611046], [-79.58633, 43.610948], [-79.585591, 43.610418], [-79.585205, 43.610159], [-79.584524, 43.609711], [-79.584445, 43.609655], [-79.584306, 43.60956], [-79.584018, 43.609363], [-79.583965, 43.609323], [-79.583829, 43.609219], [-79.583741, 43.609161], [-79.583483, 43.608954], [-79.583115, 43.608674], [-79.582816, 43.608563], [-79.582712, 43.608489], [-79.58228, 43.608205], [-79.582153, 43.608118], [-79.582111, 43.608085], [-79.582085, 43.607966], [-79.58185, 43.607798], [-79.58175, 43.607727], [-79.581712, 43.6077], [-79.579865, 43.606406], [-79.579164, 43.605906], [-79.578788, 43.605637], [-79.578338, 43.605321], [-79.577467, 43.604707], [-79.576772, 43.604225], [-79.576624, 43.604122], [-79.576536, 43.604062], [-79.576049, 43.603716], [-79.575407, 43.603277], [-79.575331, 43.603223], [-79.575113, 43.603066], [-79.57504, 43.603015], [-79.574968, 43.602965], [-79.574826, 43.602867], [-79.574736, 43.602796], [-79.574434, 43.602567], [-79.573803, 43.602136], [-79.573296, 43.60179], [-79.572929, 43.601526], [-79.571893, 43.600793], [-79.571734, 43.600688], [-79.570985, 43.600149], [-79.570733, 43.599841], [-79.570596, 43.599587], [-79.570484, 43.598972], [-79.57039, 43.598629], [-79.570366, 43.598318], [-79.570319, 43.597828], [-79.570227, 43.597558], [-79.570072, 43.597337], [-79.569952, 43.597219], [-79.569803, 43.597099], [-79.56951, 43.596909], [-79.569373, 43.596827], [-79.56862, 43.5964], [-79.56854, 43.596355], [-79.567913, 43.595979], [-79.567213, 43.595562], [-79.567124, 43.595467], [-79.567071, 43.595329], [-79.567076, 43.595276], [-79.56714, 43.59521], [-79.567202, 43.595169], [-79.5673, 43.595137], [-79.567461, 43.595118], [-79.568397, 43.59511], [-79.568594, 43.595129], [-79.568723, 43.595183], [-79.568912, 43.595279], [-79.568993, 43.595345], [-79.569141, 43.595536], [-79.569178, 43.595621], [-79.569199, 43.595773], [-79.569149, 43.595965], [-79.569047, 43.596171], [-79.56896, 43.596253], [-79.56846, 43.596717], [-79.568391, 43.596778], [-79.566758, 43.598228], [-79.565929, 43.599004], [-79.565191, 43.599706], [-79.564558, 43.60041], [-79.56447, 43.600562], [-79.562722, 43.602126], [-79.560649, 43.603948], [-79.559702, 43.604822], [-79.559354, 43.605142], [-79.558466, 43.605953], [-79.557414, 43.606944], [-79.554197, 43.609832], [-79.553043, 43.610908], [-79.551862, 43.611923], [-79.551457, 43.612236], [-79.551044, 43.612523], [-79.550417, 43.612904], [-79.549958, 43.613143], [-79.549352, 43.613411], [-79.548817, 43.613607], [-79.54845, 43.613752], [-79.547693, 43.61398], [-79.547117, 43.614127], [-79.546834, 43.614189], [-79.546546, 43.614248], [-79.54594, 43.614345], [-79.545334, 43.614427], [-79.544854, 43.614489], [-79.542967, 43.614732], [-79.541308, 43.61495], [-79.540357, 43.61504], [-79.539893, 43.615107], [-79.538085, 43.615408], [-79.536298, 43.615751], [-79.532061, 43.6166], [-79.53086, 43.616829], [-79.529863, 43.617035], [-79.529251, 43.617156], [-79.528295, 43.617354], [-79.526002, 43.617815], [-79.510593, 43.620825], [-79.501196, 43.62274], [-79.500137, 43.622934], [-79.497207, 43.623643], [-79.496796, 43.623742], [-79.493307, 43.624586], [-79.492696, 43.624735], [-79.490263, 43.62531], [-79.4889, 43.625661], [-79.48822, 43.62583], [-79.487697, 43.625963], [-79.486799, 43.626164], [-79.48642, 43.626252], [-79.4857, 43.626422], [-79.485305, 43.626524], [-79.483827, 43.626905], [-79.483289, 43.627025], [-79.482128, 43.627343], [-79.481812, 43.627449], [-79.481282, 43.627657], [-79.480853, 43.62786], [-79.480537, 43.628014], [-79.480286, 43.628161], [-79.480027, 43.628332], [-79.479278, 43.628901], [-79.478249, 43.629754], [-79.477992, 43.629941], [-79.477369, 43.630419], [-79.475367, 43.631894], [-79.474831, 43.632252], [-79.474208, 43.632606], [-79.473197, 43.633125], [-79.47254, 43.63349], [-79.472011, 43.633802], [-79.471272, 43.634244], [-79.470464, 43.634733], [-79.469653, 43.635209], [-79.469015, 43.635528], [-79.468844, 43.63561], [-79.468412, 43.635795], [-79.466553, 43.636599], [-79.465849, 43.636902], [-79.465164, 43.637168], [-79.464751, 43.637322], [-79.4636, 43.637704], [-79.462577, 43.637995], [-79.46144, 43.63826], [-79.460284, 43.638489], [-79.459468, 43.638623], [-79.459196, 43.638663], [-79.458834, 43.638712], [-79.458465, 43.638756], [-79.457699, 43.638828], [-79.456707, 43.638886], [-79.455551, 43.638905], [-79.45499, 43.638895], [-79.453887, 43.638847], [-79.453463, 43.638822], [-79.452482, 43.638744], [-79.451402, 43.638629], [-79.45069, 43.638533], [-79.44951, 43.638349], [-79.448023, 43.638056], [-79.446728, 43.637741], [-79.446279, 43.637616], [-79.445607, 43.637412], [-79.44507, 43.637247], [-79.444666, 43.637109], [-79.44374, 43.636738], [-79.44098, 43.635568], [-79.437526, 43.634103], [-79.436737, 43.633756], [-79.435105, 43.633067], [-79.434723, 43.632925], [-79.434156, 43.632746], [-79.433424, 43.632574], [-79.4327, 43.632469], [-79.431952, 43.632408], [-79.431548, 43.6324], [-79.430991, 43.63242], [-79.430469, 43.632462], [-79.430145, 43.632496], [-79.429166, 43.632717], [-79.428636, 43.632844], [-79.428005, 43.633032], [-79.425151, 43.6338], [-79.421703, 43.634728], [-79.421314, 43.63484], [-79.418281, 43.635715], [-79.414238, 43.636853], [-79.413152, 43.637134], [-79.412216, 43.637304], [-79.411836, 43.63735], [-79.41163, 43.637374], [-79.410716, 43.637426], [-79.4087, 43.637429], [-79.407575, 43.637462], [-79.406782, 43.63752], [-79.403008, 43.637866], [-79.402605, 43.637889], [-79.402384, 43.637902], [-79.401749, 43.637919], [-79.401191, 43.637913], [-79.400392, 43.637881], [-79.399999, 43.637865], [-79.399006, 43.637833], [-79.398693, 43.637775], [-79.397823, 43.637724], [-79.397282, 43.637726], [-79.39708, 43.637746], [-79.396122, 43.637904], [-79.394924, 43.638101], [-79.393404, 43.638352], [-79.393114, 43.6384], [-79.392766, 43.63846], [-79.392469, 43.638535], [-79.392367, 43.638564], [-79.392316, 43.638581], [-79.392248, 43.638623], [-79.392195, 43.638683], [-79.392465, 43.639333], [-79.392514, 43.639469], [-79.39259, 43.639744], [-79.392677, 43.640038], [-79.392707, 43.640139], [-79.392837, 43.640498], [-79.392862, 43.640567], [-79.3929, 43.640666], [-79.392922, 43.640731], [-79.393161, 43.641375], [-79.393208, 43.641502], [-79.393629, 43.642469], [-79.393754, 43.642765], [-79.393815, 43.642895], [-79.393933, 43.64317], [-79.39398, 43.64328], [-79.394109, 43.643515], [-79.394157, 43.643608], [-79.39433, 43.644038], [-79.394444, 43.644313], [-79.394493, 43.644443], [-79.394542, 43.644569], [-79.394608, 43.644738], [-79.394647, 43.644839], [-79.394744, 43.645109], [-79.394784, 43.645219], [-79.394892, 43.645487], [-79.394893, 43.64549], [-79.39479, 43.645511], [-79.393881, 43.645702], [-79.393591, 43.645765], [-79.393479, 43.645789], [-79.392433, 43.646017], [-79.392304, 43.646044], [-79.39231, 43.646058], [-79.392398, 43.646262], [-79.39241, 43.646286], [-79.392519, 43.646506], [-79.392801, 43.647242], [-79.392821, 43.647292], [-79.39283, 43.647315], [-79.392832, 43.64732], [-79.392859, 43.647389], [-79.392975, 43.647665], [-79.393063, 43.647875], [-79.393248, 43.648331], [-79.393283, 43.648416], [-79.393313, 43.648488], [-79.393447, 43.64883], [-79.39348, 43.648919], [-79.3936, 43.64921], [-79.39364, 43.649311], [-79.393646, 43.649328], [-79.393539, 43.649348], [-79.393415, 43.649375], [-79.393294, 43.6494], [-79.392115, 43.649649], [-79.39212, 43.649664], [-79.392154, 43.649754], [-79.392272, 43.650077], [-79.392376, 43.650322], [-79.39251, 43.650635], [-79.392591, 43.650828], [-79.392607, 43.650871], [-79.392631, 43.650926], [-79.392653, 43.650984], [-79.392745, 43.651207], [-79.392986, 43.651782], [-79.393019, 43.651867], [-79.393364, 43.652702], [-79.393387, 43.65276], [-79.393803, 43.653746], [-79.393827, 43.653806], [-79.393832, 43.653816], [-79.393735, 43.653837], [-79.392671, 43.654057]]";
    this.currentRoute = JSON.parse(route);
    console.log(this.currentRoute);
    this.tripService.setListOfNodes(this.currentRoute);
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
          this.currentRoute = request.listOfNodes;
          console.log(this.currentRoute);
        });

      }
    });
  }

  hasBeenClicked(tag: string) {
    if (tag === 'restaurant') {
      this.restaurantClicked = !this.restaurantClicked;
    } else if (tag === 'hotels') {
      this.hotelsClicked = !this.hotelsClicked;
    } else {
      this.ttdClicked = !this.ttdClicked;
    }
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
