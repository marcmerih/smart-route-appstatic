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

        self.sessionRatings = {}

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

        self.recSys.predictSessionRestaurantRatings(self.sessionRatings)
        self.recSys.predictSessionTTDRatings(self.sessionRatings)

        # Update Predicted_Score Column in each CSV...
        restaurants_to_truncate = []
        ttds_to_truncate = []
        if len(self.stops) > 0:
            for stop in self.stops:
                if stop["id"] not in self.sessionRatings.keys():
                    self.sessionRatings[stop["id"]] = 1
                if self.sessionRatings[stop["id"]] == 1:
                    print(stop["name"])
                    if stop["type"] == 'R':
                        restaurants_to_truncate.append(stop["id"])
                    elif stop["type"] == 'T':
                        ttds_to_truncate.append(stop["id"])
                        
                
        self.geographer.graph.setPredictedScores(self.recSys.getFinalRestaurantModel(),restaurants_to_truncate, self.recSys.getFinalTTDModel(),ttds_to_truncate)
        # self.geographer.graph.setPredictedScores('T', self.recSys.getTTDModel(),ttds_to_truncate)

        

        self.route, self.stops = self.geographer.planTrip(
            self.destinations, self.tripPreferences,self.sessionRatings)

    def getTrip(self, request):
        to_json = {"route":self.route,"stops":self.stops}
        return JsonResponse(to_json)

    def updateTripPreferences(self, tripDurationPref, numStopsPref, budgetPref):
        self.tripPreferences['tripDuration'] = tripDurationPref
        self.tripPreferences['numStops'] = numStopsPref
        self.tripPreferences['budget'] = budgetPref

    def lockStop(self, poi_type, poi_id):
        # id_ = int(poi_id[1:])
        # print(id_)
        self.sessionRatings[poi_id] = 5
        print("Locked Stops",self.sessionRatings)


    def unlockStop(self, poi_type, poi_id):
        
        self.sessionRatings[poi_id] = 1
        print("Locked Stops",self.sessionRatings)

