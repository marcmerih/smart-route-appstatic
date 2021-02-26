import random
import pandas as pd

restaurants_data = pd.read_csv(r"data/item/resDataClean.csv")
ttds_data = pd.read_csv(r"data/item/ttdDataClean.csv")


class Graph(object):
    def __init__(self, nodes={}):
        self.nodes = nodes

    def reset(self):

        for node_id in list(self.nodes.keys()):
            self.nodes[node_id].estimatedCost = 0
            self.nodes[node_id].history = [[],0] #Selected POIS, Total Travel Time  
            # if self.nodes[node_id].type == 'poi':
            #     self.nodes[node_id].predicted_score = random.uniform(1, 5)
            # else:
            #     self.nodes[node_id].predicted_score = 0

    def setPredictedScores(self, restaurant_scores, ttd_scores):
        # for poi_id, predicted_score in enumerate(scores, start=0):
        for i in range(len(restaurant_scores)):
            _itemRow = restaurants_data.loc[i]
            _id = _itemRow["index"][1:]
            self.nodes[_id].predicted_score = restaurant_scores[i] 

        for j in range(len(ttd_scores)):
            _itemRow = ttds_data.loc[i]
            _id = _itemRow["index"][1:]
            _TTDID = str(int(_id)+4000)
            self.nodes[_id].predicted_score = ttd_scores[j] 
    


class Node(object):
    def __init__(self, _id, lat, lon, _type, predicted_score, edges=[], estimatedCost=None, history=[]):
        self.id = _id
        self.lat = lat
        self.lon = lon
        self.type = _type
        self.predicted_score = predicted_score
        self.edges = edges
        self.estimatedCost = estimatedCost
        self.history = history

    def copy(self):
        return Node(self.id, self.lat, self.lon, self.type, self.predicted_score, self.edges, self.estimatedCost, self.history)

    def __eq__(self, other):
        return (self.id,self.history[0]) == (other.id,other.history[0])

    def __lt__(self, other):
        return self.estimatedCost < other.estimatedCost

    def __hash__(self):
        return hash(self.id)

    def __repr__(self):
        return "<Node id=%(id)s, (lat,lon)=(%(lat)s,%(lon)s)>" % {
            'id': self.id,
            'lat': self.lat,
            'lon': self.lon,
            'type': self.type,
            
        }


class Edge(object):
    def __init__(self, _id, destinationNode, sourceNode, length, speed):
        self.id = _id
        self.destinationNodeID = destinationNode
        self.sourceNodeID = sourceNode
        self.length = length
        self.speed = speed

    def __eq__(self, other):
        return self.id == other.id

    def __repr__(self):
        return "<Edge destNode=%(destNode)s, sourceNode=%(sourceNode)s, length=%(length)s>" % {
            'destNode': self.destinationNodeID,
            'sourceNode': self.sourceNodeID,
            'length': self.length,
        }
