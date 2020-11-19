from .routing import Router
from .misc import getDistance
import pandas as pd
import numpy as np
from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
import json

restaurants_data = pd.read_csv('resDataExample.csv')


class Trip():
    def __init__(self):
        self.startingLocation = ''
        self.endingLocation = ''
        self.maximumDetour = 100
        self.stops = []
        self.route = []
        self.router = Router()

        self.sort_by = "review_score"

        self.restaurantsInDistance = []
        self.hotelsInDistance = []
        self.ttdInDistance = []

    def initializeDestinations(self):
        self.stops = [self.router.GeoEncode(
            self.startingLocation), self.router.GeoEncode(self.endingLocation)]

    def setRoute(self):
        self.route = self.router.Route(self.stops)

    def getRoute(self, request):
        return HttpResponse('{ "listOfNodes":"' + str(self.route) + '"}')

    def setRestaurantsInDistance(self):
        global restaurants_data
        poi_coords = restaurants_data[["lon", "lat"]].values.tolist()
        distance_matrix = []
        for poi in poi_coords:
            clostest_node_in_route = np.sum(
                abs(np.matrix(self.route)-poi), axis=1).argmin()
            distance_matrix.append(getDistance(
                self.route[clostest_node_in_route], poi))
        self.restaurantsInDistance = [
            dist <= self.maximumDetour for dist in distance_matrix]

    def getRestaurantsInDistance(self):
        # res_dict = restaurants_data[self.restaurantsInDistance].sort_values(
        #     self.sort_by, ascending=False).to_dict()
        # res_name_dict = res_dict["restaurant_name"]
        # res_address_dict = res_dict["address"]
        # res_review_dict = res_dict["review_score"]
        # res_lon_dict = res_dict["lon"]
        # res_lat_dict = res_dict["lat"]
        restaurants = restaurants_data[self.restaurantsInDistance].sort_values(
            "review_score", ascending=False).reset_index()
        restaurants_info = restaurants[["restaurant_name",
                                        "address", "review_score"]].values.tolist()
        restaurants_coords = restaurants[["lon", "lat"]].values.tolist()

        # json_response = simplejson.dumps(
        #     {
        #         "listOfRestaurantsInfo" : restaurants_info,
        #         "listOfRestaurantsCoords": restaurants_coords
        #     }
        # )
        response_data = {}
        response_data['listOfRestaurantsInfo'] = restaurants_info
        response_data['listOfRestaurantsCoords'] = restaurants_coords
        return HttpResponse(json.dumps(response_data), content_type="application/json")
        # return HttpResponse(json_response, content_type ="application/json")

        # return HttpResponse('{ "listOfRestaurantsInfo":"' + str(restaurants_info) + '", "listOfRestaurantsCoords":"' + str(restaurants_coords) + '"}')

    # def addStop(addresses):
    #     listOfAddresses = addresses.split('')
    # listOfNodes = Route(startingLocation, endingLocation)
        # return HttpResponse('{ "listOfNodes":"' + str(listOfNodes) + '"}')
