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
        return (self.id,self.estimatedCost,self.history[0]) == (other.id,other.estimatedCost,other.history[0])

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
    def __init__(self, _id, destinationNode, sourceNode, length,speed):
        self.id = _id
        self.destinationNode = destinationNode
        self.sourceNode = sourceNode
        self.length = length
        self.speed = speed

    def __eq__(self, other):
        return self.id == other.id

    def __repr__(self):
        return "<Edge destNode=%(destNode)s, sourceNode=%(sourceNode)s, length=%(length)s, speed=%(speed)s>" % {
            'destNode': self.destinationNode.id,
            'sourceNode': self.sourceNode.id,
            'length': self.length,
            'speed': self.speed
        }
