# -*- coding: utf-8 -*-
from __future__ import unicode_literals

# from pyroutelib3 import Router # Import the router

from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from map.models import DefaultRoute
from map.serializers import DefaultRouteSerializer
from .routing import Router
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from rest_framework.mixins import (
    CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin
)
from rest_framework.viewsets import GenericViewSet
from rest_framework import viewsets

class DefaultRouteViewSet(viewsets.ModelViewSet):
    queryset = DefaultRoute.objects.all()
    serializer_class = DefaultRouteSerializer

class FrontendRenderView(View):
    def get(self, request, *args, **kwargs):
        return render(request, "home.html", {})


def getRoute(request, startingLocation, endingLocation, maximumDetour):
    router = Router()
    coords = [router.GeoEncode(startingLocation), router.GeoEncode(endingLocation)]
    listOfNodes = router.Route(coords)
    return HttpResponse(str(listOfNodes))

def addIntermediate(request, startingLocation, endingLocation, maximumDetour, addresses):
    listOfAddresses = list(addresses)
    # listOfNodes = Route(startingLocation, endingLocation)
    return HttpResponse('{ "listOfNodes":"' + str(listOfNodes) + '"}')