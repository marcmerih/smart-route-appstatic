# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


class DefaultRoute(models.Model):
    startingAddress = models.CharField(max_length=100)
    endingAddress = models.CharField(max_length=100)
