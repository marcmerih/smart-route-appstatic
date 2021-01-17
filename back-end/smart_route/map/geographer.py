from math import sin, cos, sqrt, atan2, radians
from .graph import Graph, Node, Edge
from geopy.geocoders import Nominatim
import heapq as heap
import jsonpickle
import json
from collections import namedtuple

class Graph(object):
    def __init__(self):
        self.nodes = {}

    def reset(self):
        for node_id in list(self.nodes.keys()):
            self.nodes[node_id].estimatedCost = 0
            self.nodes[node_id].history = []


class Node(object):
    def __init__(self, _id, lat, lon, _type, predicted_score, rev_score, edges=[], estimatedCost=None, history=[]):
        self.id = _id
        self.lat = lat
        self.lon = lon
        self.type = _type
        self.rev_score = rev_score
        self.predicted_score = predicted_score
        self.edges = edges
        self.estimatedCost = estimatedCost
        self.history = history

    def copy(self):
        return Node(self.id, self.lat, self.lon, self.type, self.rev_score, self.predicted_score, self.edges, self.estimatedCost, self.history)

    def __eq__(self, other):
        return (self.id, self.estimatedCost, self.history) == (other.id, other.estimatedCost, other.history)

    def __lt__(self, other):
        return self.estimatedCost < other.estimatedCost

    def __hash__(self):
        return hash(self.id)

    def __repr__(self):
        return "<Node id=%(id)s, (lat,lon)=(%(lat)s,%(lon)s), rev_score=%(rev_score)s>" % {
            'id': self.id,
            'lat': self.lat,
            'lon': self.lon,
            'type': self.type,
            'rev_score': self.rev_score,
        }


class Edge(object):
    def __init__(self, _id, destinationNode, sourceNode, length):
        self.id = _id
        self.destinationNode = destinationNode
        self.sourceNode = sourceNode
        self.length = length

    def __eq__(self, other):
        return self.id == other.id

    def __repr__(self):
        return "<Edge destNode=%(destNode)s, sourceNode=%(sourceNode)s, length=%(length)s>" % {
            'destNode': self.destinationNode.id,
            'sourceNode': self.sourceNode.id,
            'length': self.length,
        }

class Geographer():

    def __init__(self):
        self.geolocator = Nominatim(user_agent="smart-route")

        self.graph = Graph()
        self.LoadGraph()

    def LoadGraph(self):
        global Graph
        o = open('data/Graph/graph.json', 'r')
        frozen = o.read()
        self.graph = jsonpickle.loads(frozen, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
        print('Done loading graph')
        print(frozen[:1000])

    def GeoEncode(self, address):
        location = self.geolocator.geocode(address)
        return [location.latitude, location.longitude]

    def planTrip(self, destinations, tripPreferences):
        # Add Destinations to Graph
        startNode_id = self.getClosestGraphNode(destinations[0])
        endNode_id = self.getClosestGraphNode(destinations[1])

        # Todo: Plan Trip Between Coords -> A* Trip Planning Algorithm
        trip = self.aStar(startNode_id, endNode_id)

        route = trip[0]  # List of coords for the full route

        stops = trip[1]  # List of POI ids to stop at

        return (route, stops)

    def getClosestGraphNode(self, coord):
        newNode = Node(1, coord[0], coord[1], 'None', 'None', 0)
        distances = []
        ids = []
        for node_id in list(self.graph.nodes.keys()):
            distances.append(self.getDistance(
                self.graph.nodes[node_id], newNode))
            ids.append(node_id)
        return ids[distances.index(min(distances))]

    def setPredictedScores(self, poi_type_identifier, scores):
        for poi_id, predicted_score in enumerate(scores, start=1):
            _id = poi_type_identifier + str(poi_id)
            self.graph.nodes[_id].predicted_score = predicted_score

    def aStar(self, startNode_id, goalNode_id):
        startNode = self.graph.nodes[str(startNode_id)]
        goalNode = self.graph.nodes[str(goalNode_id)]
        parents = {}
        costs = {}
        priorityQueue = []
        startNode.estimatedCost = self.heuristic(startNode, goalNode)
        parents[startNode] = None
        costs[startNode] = 0
        priorityQueue.append(startNode)

        while (len(priorityQueue) > 0):
            node = heap.heappop(priorityQueue)
            if (node == goalNode):
                return self.getGeoList(parents, startNode, goalNode)

            for edge in node.edges:
                nextNode = self.graph.nodes[str(edge.destinationNodeID)]

                # This is the cost function
                newCost = costs[node] + edge.length  # g(n)

                if ((nextNode not in parents.keys()) or (newCost < costs[nextNode])):
                    parents[nextNode] = node
                    costs[nextNode] = newCost
                    nextNode.estimatedCost = self.heuristic(
                        nextNode, goalNode) + newCost
                    priorityQueue.append(nextNode)

    def heuristic(self, node, goalNode):
        return self.getDistance(node, goalNode)

    def getDistance(self, node, goalNode):
        point1 = [node.lat, node.lon]
        point2 = [goalNode.lat, goalNode.lon]
        return self.distance(point1, point2)

    def distance(self, p1, p2):
        R = 6373  # radius of the earth
        dlat = radians(p2[0]) - radians(p1[0])
        dlon = radians(p2[1]) - radians(p1[1])
        a = (sin(dlat / 2)) ** 2 + \
            cos(radians(p1[0])) * cos(radians(p2[0])) * (sin(dlon / 2)) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return R * c

    def getGeoList(self, parents, startNode, goalNode):
        geolist = []
        poi_list = [["restaurant", "Name of Restaurant", "Address of Restaurant", "$$$"], [
            "ttd", "Name of Attraction", "Address of Attraction", "Type of TTD (Attraction)"]]
        geolist.append([goalNode.lat, goalNode.lon])
        thisNode = goalNode
        while (thisNode.id != startNode.id):
            geolist.append([thisNode.lat, thisNode.lon])
            thisNode = parents[thisNode]
        return [list(reversed(geolist)), list(reversed(poi_list))]
