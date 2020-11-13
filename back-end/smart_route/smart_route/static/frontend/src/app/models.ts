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