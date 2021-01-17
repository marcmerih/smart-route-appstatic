# from .planner import Planner
from .user import User
from .recommender import RecSys
from .geographer import Geographer
import pandas as pd
import numpy as np
from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
import json


restaurants_data = pd.read_csv(r"data/resDataExample.csv")
# hotels_data = pd.read_csv(r"/Users/merihatasoy/Documents/Projects/Web Apps/capstone/smart-route-appstatic/back-end/smart_route/map/hotelDataExample.csv")
# ttds_data = pd.read_csv(r"/Users/merihatasoy/Documents/Projects/Web Apps/capstone/smart-route-appstatic/back-end/smart_route/map/ttdDataExample.csv")


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
            'tripDuration': [], 'numStops': [], 'budget': [], 'keyphrases': []}

    def initializeDestinations(self):
        self.destinations = [self.geographer.GeoEncode(
            self.startingLocation), self.geographer.GeoEncode(self.endingLocation)]

    def addUserToTrip(self, user):
        self.users.append(user)

        # Build The Predicted Item Score Vector for each POI Type
        self.recSys.predictRestaurantRatings(self.users)
        self.recSys.predictHotelRatings(self.users)
        self.recSys.predictTTDRatings(self.users)

        # Update Predicted_Score Column in each CSV...
        self.geographer.setPredictedScores('R', recSys.getRestaurantModel())
        self.geographer.setPredictedScores('H', recSys.getHotelModel())
        self.geographer.setPredictedScores('T', recSys.getTTDModel())

    def planTrip(self):
        self.route, self.stops = self.geographer.planTrip(
            self.destinations, self.tripPreferences)

    def getTrip(self, request):
        return HttpResponse('{ "route":"' + str(self.route) + '" , "stops":"' + str(self.stops) + '" + }')

    def updateTripPreferences(self, tripDurationPref, numStopsPref, budgetPref, keyphrases):
        self.tripPreferences['tripDuration'] = tripDurationPref
        self.tripPreferences['numStops'] = numStopsPref
        self.tripPreferences['budget'] = budgetPref
        self.tripPreferences['keyphrases'] = keyphrases

    def lockStop(self, poi_type, poi_id):
        global restaurants_data
        global hotels_data
        global ttds_data

        if poi_type == 'restaurant':
            # Write To: restaurants_data (csv)
            # For POI === poi_id: 1) Record predicted_score value, 2) Change predicted_score to infinity
            self.lockedStops[poi_id] = recordedPredictedScore
            # ...

        elif poi_type == 'hotel':
            # ...
            return;

        elif poi_type == 'ttd':
            # ...
            return;

    def unlockStop(self, poi_type, poi_id):
        global restaurants_data
        global hotels_data
        global ttds_data

        if poi_type == 'restaurant':
            # Write To: restaurants_data (csv)
            # For POI === poi_id: 1) Change predicted_score to recordedPredicatedScore, 2) Remove from lockedStops
            del self.lockedStops[poi_id]

            # ...

        elif poi_type == 'hotel':
            # ...
            return;

        elif poi_type == 'ttd':
            # ...
            return;
