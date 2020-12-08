import openrouteservice

class Router():

    def __init__(self):
        self.client = openrouteservice.Client(key='5b3ce3597851110001cf6248bc140663f03343e5aa7be735985a0c4f') # Specify your personal API key
    
    def GeoEncode(self, address):
        geo_coords = openrouteservice.geocode.pelias_autocomplete(self.client, address)
        return geo_coords['features'][0]['geometry']['coordinates'] # (longitude, latitude)

    def Route(self, coords):
        route = self.client.directions(coords, format = "geojson")
        if (route['features'][0]['geometry']['coordinates']):
            return route['features'][0]['geometry']['coordinates']

    



