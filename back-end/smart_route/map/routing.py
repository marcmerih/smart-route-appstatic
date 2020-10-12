# from pyroutelib3 import Router  # Import the router
# from geopy.geocoders import Nominatim
# import ol


def GeoEncode(address):
    geolocator = Nominatim(user_agent="smart-route")
    location = geolocator.geocode(address)
    # print(location)
    return (location.latitude, location.longitude)


def Route(point1, point2):
    router = Router("car")  # Initialise car Router
    lat1, lon1 = GeoEncode(point1)
    lat2, lon2 = GeoEncode(point2)
    start = router.findNode(lat1, lon1)  # Find start and end nodes
    end = router.findNode(lat2, lon2)

    # Find the route - a list of OSM nodes
    status, route = router.doRoute(start, end)

    if status == 'success':
        # Get actual route coordinates
        routeLatLons = list(map(router.nodeLatLon, route))
        return routeLatLons

    else:
        return status

# address1 = "601 Lakeside Rd, Fort Erie, ON"
# address2 = "601 Lakeview Rd, Fort Erie, ON"
# route = Route(address1,address2)
# print(route)
