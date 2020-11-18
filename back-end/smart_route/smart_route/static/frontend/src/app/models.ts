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
    listOfRestaurants: string;
    // restaurantNames: string; // string of a dictionaries
    // restaurantRatings: string;
    // restaurantLats: string;
    // restaurantLons: string;
    // restaurantAddresses: string;
}