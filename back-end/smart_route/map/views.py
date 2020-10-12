# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
from map.models import DefaultRoute
from map.serializers import DefaultRouteSerializer
# from .routing import Route
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

# Create your views here.


@csrf_exempt
def get_data(request):
    data = DefaultRoute.objects.all()
    if request.method == 'GET':
        serializer = DefaultRouteSerializer(data, many=True)
        return JsonResponse(serializer.data, safe=False)


def home(request):
    # route = Route("Toronto General Hospital",
    #               "75 Sussex Mews, Toronto, ON")
    # return render(request, "home.html", {'route': route})
    return render(request, "home.html", {});

class FrontendRenderView(View):
    def get(self, request, *args, **kwargs):
        return render(request, "home.html", {})