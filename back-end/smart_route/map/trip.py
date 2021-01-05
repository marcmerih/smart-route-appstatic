from .routing import Router
from .user import User
from .recommender import RecSys
from .misc import getDistance
import pandas as pd
import numpy as np
from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
import json

restaurants_data = pd.read_csv('resDataExample.csv')
hotels_data = pd.read_csv('hotelDataExample.csv')
ttds_data = pd.read_csv('ttdDataExample.csv')


class Trip():
    def __init__(self):
        self.user = User()  # A User Class Object
        self.recSys = RecSys()

        self.startingLocation = ''
        self.endingLocation = ''

        self.user_restaurants_data = ''
        self.user_hotels_data = ''
        self.user_ttds_data = ''

        # For Manual-Routing

        self.maximumDetour = 3  # In KM
        self.stops = []
        self.route = []
        self.router = Router()

        self.sort_by = "review_score"  # Will be RecScore

        self.restaurantsInDistance = []
        self.hotelsInDistance = []
        self.ttdInDistance = []

        # For Auto-Routing

        self.auto_stops1 = []
        self.auto_route1 = []

        self.auto_stops2 = []
        self.auto_route2 = []

        self.auto_stops3 = []
        self.auto_route3 = []

    def signInToTrip(self, user):
        self.user = user

        self.recSys.predictUserRestaurantRatings(user.restaurant_ratings)
        self.recSys.predictUserHotelRatings(user.hotel_ratings)
        self.recSys.predictUserTTDRatings(user.ttd_ratings)

        global restaurants_data

        self.user_restaurants_data = restaurants_data.extend(
            self.recSys.getRestaurantModel(self.user.username))
        # getUserRestaruantPredictedScores(username) would return a column list of predicted ratings for that user

        # self.user_restaurants_data.extend(
        #     self.recSys.getUserRestaruantRatings(self.user.username))
        # getUserRestaruantRatings(username) would return a column list of ratings for that user

        global hotels_data

        self.user_hotels_data = hotels_data.extend(
            self.recSys.getHotelModel(self.user.username))

        # self.user_hotels_data.extend(getUserHotelRatings(username))

        global ttds_data

        self.user_ttds_data = ttds_data.extend(
            self.recSys.getTTDModel(self.user.username))

        # self.user_ttds_data.extend(getUserTTDRatings(username))

    # ------ For Manual-Routing -------

    def initializeDestinations(self):
        self.stops = [self.router.GeoEncode(
            self.startingLocation), self.router.GeoEncode(self.endingLocation)]

    def setRoute(self):
        self.route = self.router.Route(self.stops)

    def getRoute(self, request):
        return HttpResponse('{ "listOfNodes":"' + str(self.route) + '"}')

    def setRestaurantsInDistance(self):
        poi_coords = self.user_restaurants_data[["lon", "lat"]].values.tolist()
        distance_matrix = []
        for poi in poi_coords:
            clostest_node_in_route = np.sum(
                abs(np.matrix(self.route)-poi), axis=1).argmin()
            distance_matrix.append(getDistance(
                self.route[clostest_node_in_route], poi))
        self.restaurantsInDistance = [
            dist <= self.maximumDetour for dist in distance_matrix]

    def getRestaurantsInDistance(self):
        restaurants = self.user_restaurants_data[self.restaurantsInDistance].sort_values(
            self.sort_by, ascending=False).reset_index()
        restaurants_info = restaurants[["restaurant_name",
                                        "address", "review_score", "predicted_score", "user_rating"]].values.tolist()
        restaurants_coords = restaurants[["lon", "lat"]].values.tolist()

        response_data = {}
        response_data['listOfRestaurantsInfo'] = restaurants_info
        response_data['listOfRestaurantsCoords'] = restaurants_coords
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    def setHotelsInDistance(self):
        global hotels_data
        poi_coords = hotels_data[["lon", "lat"]].values.tolist()
        distance_matrix = []
        for poi in poi_coords:
            clostest_node_in_route = np.sum(
                abs(np.matrix(self.route)-poi), axis=1).argmin()
            distance_matrix.append(getDistance(
                self.route[clostest_node_in_route], poi))
        self.hotelsInDistance = [
            dist <= self.maximumDetour for dist in distance_matrix]

    def getHotelsInDistance(self):
        hotels = hotels_data[self.hotelsInDistance].sort_values(
            self.sort_by, ascending=False).reset_index()
        hotels_info = hotels[["hotel_name",
                              "address", "review_score", "predicted_score", "user_rating"]].values.tolist()
        hotels_coords = hotels[["lon", "lat"]].values.tolist()

        response_data = {}
        response_data['listOfHotelsInfo'] = hotels_info
        response_data['listOfHotelsCoords'] = hotels_coords
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    def setTTDsInDistance(self):
        global ttds_data
        poi_coords = ttds_data[["lon", "lat"]].values.tolist()
        distance_matrix = []
        for poi in poi_coords:
            clostest_node_in_route = np.sum(
                abs(np.matrix(self.route)-poi), axis=1).argmin()
            distance_matrix.append(getDistance(
                self.route[clostest_node_in_route], poi))
        self.ttdsInDistance = [
            dist <= self.maximumDetour for dist in distance_matrix]

    def getTTDsInDistance(self):
        ttds = ttds_data[self.ttdsInDistance].sort_values(
            self.sort_by, ascending=False).reset_index()
        ttds_info = ttds[["ttd_name",
                          "address", "review_score", "predicted_score", "user_rating"]].values.tolist()
        ttds_coords = ttds[["lon", "lat"]].values.tolist()

        response_data = {}
        response_data['listOfHotelsInfo'] = ttds_info
        response_data['listOfHotelsCoords'] = ttds_coords
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    def addStop(self, stops):
        for stop in stops.split('-,'):
            self.stops.insert(len(self.stops)-1, self.router.GeoEncode(stop))

        self.route = self.router.Route(self.stops)
        return HttpResponse('{ "listOfNodes":"' + str(self.route) + '"}')

    # ------ For Auto-Routing -------

    def setAutoCompletedRoutes(self):
        # Handle stops already selected in self.stops
        # Set Routes 1,2,3 -> Lists of Nodes in a Route
        # Set Stops 1,2,3 -> Coords of Stops for Each Route
        return None

    def getAutoCompletedRoute1(self):
        # Return Route 1
        return None

    def getAutoCompletedRoute2(self):
        # Return Route 2
        return None

    def getAutoCompletedRoute3(self):
        # Return Route 3
        return None
