export class TripSettings {
    maximumDetourDuration: number;
}

export enum RoutingSteps {
    routeStartEnd = 0,
    tripDetails = 1
}
  
export class RouteModel {
    listOfNodes: string;
}

export class RestaurantsModel {
    listOfRestaurantsInfo: any;
    listOfRestaurantsCoords: any;
}

export class HotelsModel {
    listOfHotelsInfo: any;
    listOfHotelsCoords: any;
}

export class TTDModel {
    listOfTTDInfo: any;
    listOfTTDCoords: any;
}

export class RouteObject {
    startingLocation: string;
    endingLocation: string;
    maximumDetourDuration: number;
    stops: string[];
}