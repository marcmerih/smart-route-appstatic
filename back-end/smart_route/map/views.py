# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from map.models import DefaultRoute
from map.serializers import DefaultRouteSerializer

from .trip import Trip
from .user import User
from .recommender import RecSys

from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from rest_framework.mixins import (
    CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin
)
from rest_framework.viewsets import GenericViewSet
from rest_framework import viewsets

trip = Trip()

user = User()

guests = []


class DefaultRouteViewSet(viewsets.ModelViewSet):
    queryset = DefaultRoute.objects.all()
    serializer_class = DefaultRouteSerializer


class FrontendRenderView(View):
    def get(self, request, *args, **kwargs):
        return render(request, "home.html", {})


def signIn(request, username, password):
    global user
    global trip

    signedIn = user.loadUser(username,password,trip)

    if signedIn == 0:
        # Bad, Return No Account Found Error
        print("No Account Found Error")

    trip.addUserToTrip(user)
    userObject = {"username":username}
    return JsonResponse(userObject)


def addGuestToTrip(request, username, password):
    global user
    global guests

    guestUser = User()
    signedIn = guestUser.loadUser(username, password, trip)

    guests.append(guestUser)

    trip.addUserToTrip(guestUser)

    userObject = {"username":username}
    return JsonResponse(userObject)

 
def createUser(request, username, password):
    global user
    global trip

    user.createUser(username, password,trip)
            
    seedPreferences = user.getSeedPreferences()
    trip.addUserToTrip(user)
    
    return JsonResponse(seedPreferences)


def getInitialTrip(request, startingLocation, endingLocation):
    global trip
    trip.startingLocation = startingLocation  # Set Starting Location
    trip.endingLocation = endingLocation  # Set Ending Location
    trip.tripPreferences =  {'tripDuration': None, 'numStops': None, 'budget': None}
    trip.initializeDestinations()  #
    trip.planTrip()
    return trip.getTrip(request)


def refreshTrip(request, tripDurationPref, numStopsPref, budgetPref):
    global trip
    trip.updateTripPreferences(
        tripDurationPref, numStopsPref, budgetPref)
    trip.planTrip()
    return trip.getTrip(request)


def lockStop(request, poi_type, poi_id):
    global trip
    trip.lockStop(poi_type, poi_id)

    return HttpResponse(1)


def unlockStop(request, poi_type, poi_id):
    global trip
    trip.unlockStop(poi_type, poi_id)

    return HttpResponse(1)


def setRating(request, poi_type, poi_id, score):
    global user
    user.setItemRating(poi_type, poi_id, score)

    return HttpResponse(1)


