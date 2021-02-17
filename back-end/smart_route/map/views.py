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

    signedIn = user.loadUser(username, password)

    if signedIn == 0:
        # Bad, Return No Account Found Error
        print("No Account Found Error")

    trip.addUserToTrip(user)


def addGuestToTrip(request, username, password):
    global user
    global guests

    guestUser = User()
    signedIn = guestUser.loadUser(username, password)

    guests.append(guestUser)

    trip.addUserToTrip(guestUser)


def createUser(request, username, password):
    global user

    created = user.createUser(username, password)

    if created == 0:
        # Bad, Return Unique Account Error
        print("Unique Account Error")

    seedPreferences = user.getSeedPreferences()

    return seedPreferences


def getInitialTrip(request, startingLocation, endingLocation):
    global trip
    trip.startingLocation = startingLocation  # Set Starting Location
    trip.endingLocation = endingLocation  # Set Ending Location
    trip.tripPreferences =  {'tripDuration': None, 'numStops': None, 'budget': None}
    trip.initializeDestinations()  #
    trip.planTrip()
    return trip.getTrip(request)


def refreshTrip(request, tripDurationPref, numStopsPref, budgetPref, keyphrases):
    global trip
    trip.updateTripPreferences(
        tripDurationPref, numStopsPref, budgetPref, keyphrases)
    trip.planTrip()
    return trip.getTrip(request)


def lockStop(request, poi_type, poi_id):
    global trip

    trip.lockStop(poi_type, poi_id)


def unlockStop(request, poi_type, poi_id):
    global trip

    trip.unlockStop(poi_type, poi_id)


def setRating(request, poi_type, poi_id, rating):
    global user
    if poi_type == 'R':
        user.setRestaruantRating(poi_type, poi_id, rating)

    elif poi_type == 'H':
        user.setHotelRating(poi_type, poi_id, rating)

    elif poi_type == 'T':
        user.setTTDRating(poi_type, poi_id, rating)
