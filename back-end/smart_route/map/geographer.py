from math import sin, cos, sqrt, atan2, radians, ceil
from .graph import Graph, Node, Edge
from geopy.geocoders import Nominatim
import heapq as heap
import jsonpickle
import pandas as pd
import copy
import json
import ast

import jsonpickle

restaurants_data = pd.read_csv(r"data/item/resDataClean.csv")
ttds_data = pd.read_csv(r"data/item/ttdDataClean.csv")

class Geographer():

    def __init__(self):
        self.geolocator = Nominatim(user_agent="smart-route")
        self.graph = Graph()
        self.LoadGraph()
        self.graph.reset()

    def LoadGraph(self):
        print("Loading Graph...")
        o = open('data/Graph/graph.json', 'r')
        frozen = o.read()
        self.graph = json.loads(
            frozen, object_hook=object_decoder)
        print("Graph Object:", "Good" if isinstance(
            self.graph, Graph) else 'Failed')
        print("Node Object:", "Good" if isinstance(
            self.graph.nodes["666"], Node) else 'Failed')
        print("Edge Object:", "Good" if isinstance(
            self.graph.nodes["666"].edges[0], Edge) else 'Failed')
        print('Loaded Graph')

    def GeoEncode(self, address):
        location = self.geolocator.geocode(address)
        return [location.latitude, location.longitude]

    def planTrip(self, destinations, tripPreferences,lockedStops):
        # Add Destinations to Graph
        startNode_id = self.getClosestGraphNode(destinations[0])
        endNode_id = self.getClosestGraphNode(destinations[1])

        if tripPreferences['numStops'] == None:
            tripPreferencesList = [4,4,4]
        else:
            tripPreferencesList = [int(tripPreferences['numStops']),int(tripPreferences['tripDuration']),int(tripPreferences['budget'])]
        
        
        costFunctionConstants = [1,1,0.2]
        print("Routing")
        # Todo: Plan Trip Between Coords -> A* Trip Planning Algorithm
        trip = self.aStar(startNode_id, endNode_id,tripPreferencesList,costFunctionConstants,lockedStops)

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


    def aStar(self, startNode_id, goalNode_id,tripPreferences,cfConstants,lockedStops):
        global restaurants_data
        global ttds_data
        startNode = self.graph.nodes[str(startNode_id)]
        goalNode = self.graph.nodes[str(goalNode_id)]
        print(startNode,goalNode)
        tripStopsBudget = tripPreferences[0]
        tripDurationBudget = tripPreferences[1] * 60
        tripBudgetBudget = tripPreferences[2]
        parents = {} 
        costs = {}
        priorityQueue = [] #Open Set: List of Nodes to check, sorted by node.estimatedCost    
        startNode.estimatedCost = 0 + self.heuristic(startNode,goalNode) #node.estimatedCost is f(n) = g(n) + h(n) 
        parents[startNode] = None #Parents is a dictionary that stores a previousNode:nextNode pair on any given path
        costs[startNode] = 0 #Cost of the current path at any given node
        heap.heappush(priorityQueue, startNode)
            

        while (len(priorityQueue) > 0):
            # heap.heapify(priorityQueue)
            node = heap.heappop(priorityQueue)
            if (node.id == goalNode.id):
                goalNode.estimatedCost = node.estimatedCost
                goalNode.history = node.history
                return self.getGeoList(parents, startNode, goalNode,lockedStops)

            if (node.history[1] >= tripDurationBudget):
                continue

            for edge in node.edges:
                nextNode = self.graph.nodes[str(edge.destinationNodeID)]

                stop_price = 0
                if nextNode.type == 'R' : #change type to restaurant
                    resRow = restaurants_data[restaurants_data["index"]== ('R'+str(nextNode.id))]
                    stop_price = float(resRow["price"].item())
                

                # Stop if POI already stopped
                if ((str(nextNode.id) in node.history[0]) or ((len(node.history[0])) > tripStopsBudget) or (stop_price > tripBudgetBudget)):
                    continue
                
                nextNode = nextNode.copy()

                #Set nextNode history to previous Node history
                previousNodeHistory = list(node.history)

                nextNode.history = copy.deepcopy(previousNodeHistory)

                #Update nextNode history based on previous Node 
                if node.type in ['R','T']: # If previous Node was a POI
                    nextNode.history[0].append(str(node.id)) #Add Previous Node to SelectedPOIs List

                costAtNode = costs[node] 
                newCost = costAtNode + self.costFunction(self.graph,startNode,nextNode,edge,cfConstants) 
                nextNode.history[1] += (((edge.length/1000)/edge.speed)*60) #Update Total Travel Time Cost
                
                # This is the cost function
#  or (newCost < costs[nextNode])
                if (nextNode not in parents.keys() or (newCost < costs[nextNode]) or (node.type in ['R','T'])):
                    parents[nextNode] = node
                    costs[nextNode] = newCost
                    nextNode.estimatedCost = self.heuristic(nextNode, goalNode) + newCost
                    heap.heappush(priorityQueue, nextNode)

    def costFunction(self,graph,startNode,nextNode,edge,const):
        cost = 0
        distanceSinceLastPOI = 0
        
        if nextNode.type == 'road':

            cost += const[0] * (((edge.length/1000)/edge.speed)*60)
            
            if len(nextNode.history[0]) == 0:
                distanceSinceLastPOI = self.getDistance(nextNode,startNode)
            else: 
                distanceSinceLastPOI = self.getDistance(nextNode,graph.nodes[nextNode.history[0][-1]])
            
        cost *= const[1] * ((distanceSinceLastPOI)/60)*60  # Penalize too long a distance between POIs -> Calculate c2 based on Trip Length
        
        if nextNode.type in ['R','T']:
            cost += const[2] * (5-nextNode.predicted_score) # Penalize derivation from perfect predicted POI score

        
        return cost 

    def heuristic(self,node,goalNode): 
        distance = self.getDistance(node,goalNode)
        return ((distance)/60)*60 

    def getDistance(self,node,goalNode):
        point1 = [node.lat,node.lon]
        point2 = [goalNode.lat,goalNode.lon]
        return self.distance(point1,point2)

    def getManhattenDistance(self,node,goalNode):
        point1 = [node.lat,node.lon]
        point2 = [goalNode.lat,node.lon]    
        point3 = [goalNode.lat,goalNode.lon]
        return self.distance(point1,point2) + self.distance(point3,point2)

    def distance(self,p1, p2):
        R = 6373  # radius of the earth
        dlat = radians(p2[0]) - radians(p1[0])
        dlon = radians(p2[1]) - radians(p1[1])
        a = (sin(dlat / 2)) ** 2 + cos(radians(p1[0])) * cos(radians(p2[0])) * (sin(dlon / 2)) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return R * c 

    def getGeoList(self, parents, startNode, goalNode,lockedStops):
        global restaurants_data
        global ttds_data
        print("Route Done")
        geolist = []
        poi_list = []
        geolist.append([goalNode.lon, goalNode.lat])
        thisNode = goalNode
        while (thisNode.id != startNode.id):
            # geolist.append([thisNode.lat, thisNode.lon])
            geolist.append([thisNode.lon, thisNode.lat])
            thisNode = parents[thisNode]
            if (thisNode.type == 'R'):
                print("FOUND A RESTAURANT")
                resID = "R"+str(thisNode.id)
                resRow = restaurants_data[restaurants_data["index"]== resID]
                resIndex = resRow["index"].item()
                resLat = str(thisNode.lat)
                resLon = str(thisNode.lon)
                resName = resRow["item_name"].item()
                resAddress = resRow["item_address"].item()
                resTags = ast.literal_eval(resRow["categories"].item())
                resCuisineOptions = ast.literal_eval(resRow["diets"].item())
                resTAURL = resRow["url"].item()
                resTARating = resRow["review_score"].item()
                resUsersMatchPreference = ceil((thisNode.predicted_score / 5) * 100)
                isLocked = 0
                if resIndex in lockedStops:
                    isLocked = 1
                poi_dict = {'isExpanded':0,'isLocked':isLocked,'currentRating':0,'id':resIndex,'lat': resLat,'lon': resLon,'name':resName,'address':resAddress,'cats':resTags,'cuisineOptions':resCuisineOptions,'reviewsURL':resTAURL,'type':'R','tripAdvisorRating':resTARating,'usersMatchPercentage':resUsersMatchPreference,'img':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}
                poi_list.append(poi_dict)
            if (thisNode.type == 'T'):
                print("FOUND A TTD",thisNode.id,thisNode.lat,thisNode.lon,thisNode.predicted_score)
                ttdID = "T"+str(thisNode.id-4000)
                ttdRow = ttds_data[ttds_data["index"]== ttdID]
                ttdIndex = ttdRow["index"].item()
                ttdLat = str(thisNode.lat)
                ttdLon = str(thisNode.lon)
                ttdName = ttdRow["item_name"].item()
                ttdAddress = ttdRow["item_address"].item()
                ttdTags = ast.literal_eval(ttdRow["categories"].item())
                ttdTAURL = ttdRow["url"].item()
                ttdTARating = ttdRow["review_score"].item()
                ttdUsersMatchPreference = ceil((thisNode.predicted_score / 5) * 100)
                isLocked = 0
                if ttdIndex in lockedStops:
                    isLocked = 1
                poi_dict = {'isExpanded':0,'isLocked':isLocked,'currentRating':0,'id':ttdIndex,'lat': ttdLat,'lon': ttdLon,'name':ttdName,'address':ttdAddress,'cats':ttdTags,'reviewsURL':ttdTAURL,'type':'T','tripAdvisorRating':ttdTARating,'usersMatchPercentage':ttdUsersMatchPreference,'img':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}
                poi_list.append(poi_dict)

        # hardcoded_dict = {'isExpanded':0,'isLocked':0,'currentRating':0,'id': 'R125','lat': '43.648505','lon': '-79.38668700000001','name': 'Tim Hortons','address': '123 Test Rd','resTags': ["Asian", "Buffet"],'cuisineOptions': ["Vegan"],'reviewsURL': 'https://www.google.ca','type':'R','tripAdvisorRating': '4.6','usersMatchPercentage': '5','img' : 'https://bit.ly/3asKPeb', 'isExpanded': False, 'isLocked': False, 'currentRating': '0'}
        
        # poi_list.append(hardcoded_dict)

        return [list(reversed(geolist)), list(reversed(poi_list))]


    def getSeedRestaurants(self,num):
        global restaurants_data
        restaurants = []
        for i in range(num):
            _itemRow = restaurants_data.loc[i]
            restaurant_dict = {'isExpanded':0,'isLocked':0,'currentRating':0,'id':_itemRow["index"],'lat': _itemRow["lat"],'lon': _itemRow["lon"],'name':_itemRow["item_name"],'address':_itemRow["item_address"],'cats':ast.literal_eval(_itemRow["categories"]),'cuisineOptions':ast.literal_eval(_itemRow["diets"]),'reviewsURL':_itemRow["url"],'type':'R','tripAdvisorRating':_itemRow["review_score"],'usersMatchPercentage':"N/A",'img':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}
            restaurants.append(restaurant_dict)
        return restaurants

    def getSeedTTDs(self,num):
        global ttds_data
        ttds = []
        for i in range(num):
            _itemRow = ttds_data.loc[i]
            ttds_dict = {'isExpanded':0,'isLocked':0,'currentRating':0,'id':_itemRow["index"],'lat': _itemRow["lat"],'lon': _itemRow["lon"],'name':_itemRow["item_name"],'address':_itemRow["item_address"],'cats':ast.literal_eval(_itemRow["categories"]),'reviewsURL':_itemRow["url"],'type':'T','tripAdvisorRating':_itemRow["review_score"],'usersMatchPercentage':"N/A",'img':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}
            ttds.append(ttds_dict)
        return ttds

    

def object_decoder(obj):
    if 'py/object' in obj and obj['py/object'] == '__main__.Graph':
        return Graph(obj['nodes'])
    elif 'py/object' in obj and obj['py/object'] == '__main__.Node':
        return Node(obj['id'], obj['lat'], obj['lon'], obj['type'], obj['predicted_score'], obj['edges'], obj['estimatedCost'], obj['history'])
    elif 'py/object' in obj and obj['py/object'] == '__main__.Edge':
        return Edge(obj['id'], obj['destinationNodeID'], obj['sourceNodeID'], obj['length'], obj['speed'])
    
    return obj