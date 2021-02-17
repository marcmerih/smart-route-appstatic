import random

def object_decoder(obj):
    if 'py/object' in obj and obj['py/object'] == '__main__.Graph':
        return Graph(obj['nodes'])
    elif 'py/object' in obj and obj['py/object'] == '__main__.Node':
        return Node(obj['id'], obj['lat'], obj['lon'], obj['type'], obj['rev_score'], obj['predicted_score'], obj['edges'], obj['estimatedCost'], obj['history'])
    elif 'py/object' in obj and obj['py/object'] == '__main__.Edge':
        return Edge(obj['id'], obj['destinationNodeID'], obj['sourceNodeID'], obj['length'], obj['speed'])
    return obj


class Graph(object):
    def __init__(self, nodes={}):
        self.nodes = nodes

    def reset(self):
        # for node_id in list(self.nodes.keys()):
        #     self.nodes[node_id].estimatedCost = 0
        #     if (node_id == '939'): 
        #         self.nodes[node_id].predicted_score = 5
        #     self.nodes[node_id].history = [[], 0]

        for node_id in list(self.nodes.keys()):
            self.nodes[node_id].estimatedCost = 0
            self.nodes[node_id].history = [[],0] #Selected POIS, Total Travel Time  
            if self.nodes[node_id].type == 'poi':
                self.nodes[node_id].predicted_score = random.uniform(1, 5)
            else:
                self.nodes[node_id].predicted_score = 0


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
        return (self.id,self.history[0]) == (other.id,other.history[0])

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
            'destNode': self.destinationNode.id,
            'sourceNode': self.sourceNode.id,
            'length': self.length,
        }
