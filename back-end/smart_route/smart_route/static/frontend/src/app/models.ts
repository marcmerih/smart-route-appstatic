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

export class RestaurantModel {
    restaurantName: string; // string of a dictionaries
    restaurantRating: string;
    restaurantLat: string;
    restaurantLon: string;
    restaurantAddress: string;
}