# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


class DefaultRoute(models.Model):
    startingAddress = models.CharField(max_length=100)
    endingAddress = models.CharField(max_length=100)


class Restaruant(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    review_score = models.FloatField()
    price = models.FloatField()
    lat = models.FloatField()
    lon = models.FloatField()
