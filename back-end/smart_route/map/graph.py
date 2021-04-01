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
            self.nodes[node_id].history = [[],[],0,[],0,0] #Selected POIS, Total Travel Time  
            # if self.nodes[node_id].type == 'poi':
            #     self.nodes[node_id].predicted_score = random.uniform(1, 5)
            # else:
            #     self.nodes[node_id].predicted_score = 0

    def setPredictedScores(self, restaurant_scores,restaruants_to_truncate,restaurants_to_ceiling,ttd_scores,ttds_to_truncate,ttds_to_ceiling):
        # for poi_id, predicted_score in enumerate(scores, start=0):
        for i in range(len(restaurant_scores)):
            _itemRow = restaurants_data.loc[i]
            index = _itemRow["index"]
            _id = index[1:]
            if index in restaruants_to_truncate:
                print(_itemRow["item_name"],"Truncate")
                self.nodes[_id].predicted_score = -100000000
            elif index in restaurants_to_ceiling:
                print(_itemRow["item_name"],"Ceiling")
                self.nodes[_id].predicted_score = 10
            else:
                self.nodes[_id].predicted_score = restaurant_scores[i] + 2.5 # For demo purposes due to the lack of POIs.  
                # self.nodes[_id].predicted_score = random.randint(0,5)

        for j in range(len(ttd_scores)):
            _itemRow = ttds_data.loc[j]
            index = _itemRow["index"]
            _id = index[1:]
            _TTDID = str(int(_id)+4000)
            if index in ttds_to_truncate:
                print(_itemRow["item_name"],"Truncate")
                self.nodes[_TTDID].predicted_score = -100000000
            elif index in ttds_to_ceiling:
                print(_itemRow["item_name"],"Ceiling")
                self.nodes[_TTDID].predicted_score = 10
            else:
                self.nodes[_TTDID].predicted_score = ttd_scores[j] + 2.5 # For demo purposes due to the lack of POIs. 
                # self.nodes[_TTDID].predicted_score = random.randint(0,5)
    


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
        return (self.id,frozenset(self.history[0])) == (other.id,frozenset(other.history[0]))
        # return (self.id) == (other.id)

    def __lt__(self, other):
        return self.estimatedCost < other.estimatedCost

    def __hash__(self):
        return hash((self.id,frozenset(self.history[0])))
        # return hash((self.id))

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
