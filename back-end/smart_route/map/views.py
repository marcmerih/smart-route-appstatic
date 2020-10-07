# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from .routing import Route

# Create your views here.


def home(request, points):
    for i in range(len(points)):

    return HttpResponse('<h1>Map Home</h1>')
