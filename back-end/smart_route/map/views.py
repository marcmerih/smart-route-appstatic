# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from pyroutelib3 import Router # Import the router

from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from map.models import DefaultRoute
from map.serializers import DefaultRouteSerializer
# from .routing import Route
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from rest_framework.mixins import (
    CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin
)
from rest_framework.viewsets import GenericViewSet
from rest_framework import viewsets



class DefaultRouteViewSet(viewsets.ModelViewSet):
    # GenericViewSet,  # generic view functionality
    # CreateModelMixin,  # handles POSTs
    # RetrieveModelMixin,  # handles GETs for 1 Company
    # UpdateModelMixin,  # handles PUTs and PATCHes
    # ListModelMixin):  # handles GETs for many Companies

    queryset = DefaultRoute.objects.all()
    serializer_class = DefaultRouteSerializer

# def home(request):
#     # route = Route("Toronto General Hospital",
#     #               "75 Sussex Mews, Toronto, ON")
#     # return render(request, "home.html", {'route': route})
#     return render(request, "home.html", {});

router = Router("<transport mode>") # Initialise it
class FrontendRenderView(View):
    def get(self, request, *args, **kwargs):
        return render(request, "home.html", {})


def getRoute(request, startingLocation, endingLocation):
    # listOfNodes = Route(startingLocation, endingLocation)
    listOfNodes = [startingLocation, endingLocation]
    # listOfNodes=[[-79.3882155418396, 43.657828357961655],
    # [
    #     -79.38928842544556,
    #     43.657611020178535
    # ],
    # [
    #     -79.3903398513794,
    #     43.65986198052727
    # ],
    # [
    #     -79.39059734344482,
    #     43.66054501387546
    # ],
    # [
    #     -79.3905758857727,
    #     43.660731294349134
    # ],
    # [
    #     -79.39098358154297,
    #     43.66065367755534
    # ],
    # [
    #     -79.39059734344482,
    #     43.65983093337226
    # ],
    # [
    #     -79.39984560012817,
    #     43.65793702655821
    # ],
    # [
    #     -79.40036058425903,
    #     43.65902370170711
    # ]]
    return HttpResponse('{ "listOfNodes":"' + str(listOfNodes) + '"}')