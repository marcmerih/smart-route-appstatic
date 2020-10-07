from rest_framework import serializers
from map.models import DefaultRoute


class DefaultRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultRoute
        fields = ('startingAddress', 'endingAddress')
