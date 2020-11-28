# -*- coding: utf-8 -*-
from __future__ import unicode_literals

# from pyroutelib3 import Router # Import the router

from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from map.models import DefaultRoute
from map.serializers import DefaultRouteSerializer
from .routing import Router
from .trip import Trip
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from rest_framework.mixins import (
    CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin
)
from rest_framework.viewsets import GenericViewSet
from rest_framework import viewsets

trip = Trip()


class DefaultRouteViewSet(viewsets.ModelViewSet):
    queryset = DefaultRoute.objects.all()
    serializer_class = DefaultRouteSerializer


class FrontendRenderView(View):
    def get(self, request, *args, **kwargs):
        return render(request, "home.html", {})


def getInitialRoute(request, startingLocation, endingLocation, maximumDetour):
    global trip
    trip.startingLocation = startingLocation
    trip.endingLocation = endingLocation
    trip.maximumDetour = int(maximumDetour)
    trip.initializeDestinations()
    trip.setRoute()
    trip.setRestaurantsInDistance()
    # must set hotels and ttd in distance here as well
    return trip.getRoute(request)


def getRestaurants(request):
    global trip
    return trip.getRestaurantsInDistance()

def addStop(request, startingLocation, endingLocation, maximumDetour, stops):
    global trip
    trip.startingLocation = startingLocation
    trip.endingLocation = endingLocation
    trip.maximumDetour = int(maximumDetour)
    return trip.addStop(stops)
    # trip.setRoute(request)
    # trip.setRestaurantsInDistance()
    # # must set hotels and ttd in distance here as well
    # return trip.getRoute(request)

