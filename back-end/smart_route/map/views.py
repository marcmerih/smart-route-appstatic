# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
from map.models import DefaultRoute
from map.serializers import DefaultRouteSerializer
from .routing import Route

from django.views.decorators.csrf import csrf_exempt

# Create your views here.


@csrf_exempt
def get_data(request):
    data = DefaultRoute.objects.all()
    if request.method == 'GET':
        serializer = DefaultRouteSerializer(data, many=True)
        return JsonResponse(serializer.data, safe=False)


def home(request):
    # route = Route(points.startingAddress, points.endingAddress)

    return HttpResponse('<h1>Map Home</h1>')
