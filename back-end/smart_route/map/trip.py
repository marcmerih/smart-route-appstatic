# from .planner import Planner
from .user import User
from .recommender import RecSys
from .geographer import Geographer
import pandas as pd
import numpy as np
from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
import json
import jsonpickle


restaurants_data = pd.read_csv(r"data/item/resDataClean.csv")
ttds_data = pd.read_csv(r"data/item/ttdDataClean.csv")

class Trip():
    def __init__(self):
        self.users = []
        self.recSys = RecSys()
        self.geographer = Geographer()

        self.startingLocation = ''
        self.endingLocation = ''
        self.destinations = []

        self.stops = []
        self.route = []

        self.lockedStops = {}

        # Trip Preferences --Replace None with Default Settings--
        self.tripPreferences = {
            'tripDuration': None, 'numStops': None, 'budget': None}

    def initializeDestinations(self):
        self.destinations = [self.geographer.GeoEncode(
            self.startingLocation), self.geographer.GeoEncode(self.endingLocation)]

    def addUserToTrip(self, user):
        self.users.append(user)

    def planTrip(self):
        # Build The Predicted Item Score Vector for each POI Type
        self.recSys.predictRestaurantRatings(self.users)
        self.recSys.predictTTDRatings(self.users)

        # Update Predicted_Score Column in each CSV...
        print(self.recSys.getRestaurantModel())
        self.geographer.graph.setPredictedScores('R', self.recSys.getRestaurantModel())
        self.geographer.graph.setPredictedScores('T', self.recSys.getTTDModel())

        self.route, self.stops = self.geographer.planTrip(
            self.destinations, self.tripPreferences)

    def getTrip(self, request):
        to_json = {"route":self.route,"stops":self.stops}
        return JsonResponse(to_json)

    def updateTripPreferences(self, tripDurationPref, numStopsPref, budgetPref):
        self.tripPreferences['tripDuration'] = tripDurationPref
        self.tripPreferences['numStops'] = numStopsPref
        self.tripPreferences['budget'] = budgetPref

    def lockStop(self, poi_type, poi_id):

        if poi_type == 'R':
            # Write To: restaurants_data (csv)
            # For POI === poi_id: 1) Record predicted_score value, 2) Change predicted_score to infinity
            self.lockedStops[poi_type + poi_id] = self.recSys.restaurant_prediction_vector[poi_id]
            self.recSys.restaurant_prediction_vector[poi_id] = 0

        elif poi_type == 'T':
            self.lockedStops[poi_type + poi_id] = self.recSys.ttd_prediction_vector[poi_id]
            self.recSys.ttd_prediction_vector[poi_id] = 0

    def unlockStop(self, poi_type, poi_id):


        if poi_type == 'R':
            # Write To: restaurants_data (csv)
            # For POI === poi_id: 1) Change predicted_score to recordedPredicatedScore, 2) Remove from lockedStops
            self.recSys.restaurant_prediction_vector[poi_id] = self.lockedStops[poi_type + poi_id]
            del self.lockedStops[poi_type + poi_id]
            # ...

        elif poi_type == 'T':
            self.recSys.ttd_prediction_vector[poi_id] = self.lockedStops[poi_type + poi_id]
            del self.lockedStops[poi_type + poi_id]
