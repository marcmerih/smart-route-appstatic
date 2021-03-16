from math import sin, cos, sqrt, atan2, radians, ceil, log
from .graph import Graph, Node, Edge
from geopy.geocoders import Nominatim
import heapq as heap
import jsonpickle
import pandas as pd
import copy
import random

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

    def planTrip(self, destinations, tripPreferences,sessionRatings,number_of_refreshes):
        # Add Destinations to Graph
        startNode_id = self.getClosestGraphNode(destinations[0])
        endNode_id = self.getClosestGraphNode(destinations[1])

        if number_of_refreshes == 1:
            tripPreferencesList = [4,8,4]
        else:
            tripPreferencesList = [int(tripPreferences['numStops']),int(tripPreferences['tripDuration']),int(tripPreferences['budget'])]
        
        
        costFunctionConstants = [1/number_of_refreshes,0.05,2]

        print("Routing")
        # Todo: Plan Trip Between Coords -> A* Trip Planning Algorithm
        trip = self.aStar(startNode_id, endNode_id,tripPreferencesList,costFunctionConstants,sessionRatings)

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


    def aStar(self, startNode_id, goalNode_id,tripPreferences,cfConstants,sessionRatings):
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
                print("Found a Route", node.history)
                goalNode.estimatedCost = node.estimatedCost
                goalNode.history = node.history
                return self.getGeoList(parents, startNode, goalNode,sessionRatings)

            if (node.history[-1] >= tripDurationBudget):
                print("Issue is there")
                continue

            if (node.type in ['R','T'] and node.predicted_score <=1 and node.id != goalNode.id and node.id != startNode.id):
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
                    if node.type == 'R':
                        nextNode.history[1].append(str(node.id))
                        nextNode.history[2] = 0
                        nextNode.history[4] += (((edge.length/1000)/edge.speed)*60) 
                    if node.type == 'T':
                        nextNode.history[3].append(str(node.id))
                        nextNode.history[4] = 0
                        nextNode.history[2] += (((edge.length/1000)/edge.speed)*60) 
                else:
                    nextNode.history[2] += (((edge.length/1000)/edge.speed)*60) 
                    nextNode.history[4] += (((edge.length/1000)/edge.speed)*60) 

                costAtNode = costs[node] 
                newCost = costAtNode + self.costFunction(self.graph,startNode,nextNode,edge,cfConstants) 
                nextNode.history[-1] += (((edge.length/1000)/edge.speed)*60) #Update Total Travel Time Cost

                if nextNode.predicted_score == 10:
                    print(nextNode.id)
                    newCost = 0
                
                # This is the cost function
                if (nextNode not in parents.keys() or (newCost < costs[nextNode]) or (node.type in ['R','T'])):
                    parents[nextNode] = node
                    costs[nextNode] = newCost
                    nextNode.estimatedCost = 2 * sum(cfConstants) * self.heuristic(nextNode, goalNode) + newCost
                    if nextNode.predicted_score == 10:
                        
                        costs[nextNode] = 0
                        nextNode.estimatedCost = 0
                    heap.heappush(priorityQueue, nextNode)

    def costFunction(self,graph,startNode,nextNode,edge,const):
        cost = 0
    #     distanceSinceLastPOI = 0
        timeSinceLastRes = nextNode.history[2]
        timeSinceLastTTD = nextNode.history[4]
    
        if nextNode.type == 'road':
            
            cost += const[0] * (((edge.length/1000)/edge.speed)*60)

    #         if len(nextNode.history[0]) == 0:
    #             distanceSinceLastPOI = getDistance(nextNode,startNode)
    #         else: 
    #             distanceSinceLastPOI = getDistance(nextNode,graph.nodes[nextNode.history[0][-1]])

    #     cost += const[1] * ((distanceSinceLastPOI)/60)*60  # Penalize too long a distance between POIs -> Calculate c2 based on Trip Length
            
            # cost *= const[1] * timeSinceLastRes
            # cost *= const[1] * timeSinceLastTTD
            maxTimeSince = max(timeSinceLastRes,timeSinceLastTTD)
            cost += const[1] * maxTimeSince
            
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

    def getGeoList(self, parents, startNode, goalNode,sessionRatings):
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
                if (resIndex in sessionRatings.keys()) and (sessionRatings[resIndex] == 5):
                    isLocked = 1
                poi_dict = {'isExpanded':0,'isLocked':isLocked,'currentRating':0,'id':resIndex,'lat': resLat,'lon': resLon,'name':resName,'address':resAddress,'cats':resTags,'cuisineOptions':resCuisineOptions,'reviewsURL':resTAURL,'type':'R','tripAdvisorRating':resTARating,'usersMatchPercentage':resUsersMatchPreference,'img':getStockImage('R',thisNode.id)}
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
                if (ttdIndex in sessionRatings.keys()) and (sessionRatings[ttdIndex] == 5):
                    isLocked = 1
                poi_dict = {'isExpanded':0,'isLocked':isLocked,'currentRating':0,'id':ttdIndex,'lat': ttdLat,'lon': ttdLon,'name':ttdName,'address':ttdAddress,'cats':ttdTags,'reviewsURL':ttdTAURL,'type':'T','tripAdvisorRating':ttdTARating,'usersMatchPercentage':ttdUsersMatchPreference,'img':getStockImage('T',thisNode.id-4000)}
                poi_list.append(poi_dict)

        # hardcoded_dict = {'isExpanded':0,'isLocked':0,'currentRating':0,'id': 'R125','lat': '43.648505','lon': '-79.38668700000001','name': 'Tim Hortons','address': '123 Test Rd','resTags': ["Asian", "Buffet"],'cuisineOptions': ["Vegan"],'reviewsURL': 'https://www.google.ca','type':'R','tripAdvisorRating': '4.6','usersMatchPercentage': '5','img' : 'https://bit.ly/3asKPeb', 'isExpanded': False, 'isLocked': False, 'currentRating': '0'}
        
        # poi_list.append(hardcoded_dict)

        return [list(reversed(geolist)), list(reversed(poi_list))]


    def getSeedRestaurants(self,restaurantIDs):
        global restaurants_data
        restaurants = []
        image = 0
        for i in restaurantIDs:
            _itemRow = restaurants_data.loc[i]
            restaurant_dict = {'isExpanded':0,'isLocked':0,'currentRating':0,'id':_itemRow["index"],'lat': _itemRow["lat"],'lon': _itemRow["lon"],'name':_itemRow["item_name"],'address':_itemRow["item_address"],'cats':ast.literal_eval(_itemRow["categories"]),'cuisineOptions':ast.literal_eval(_itemRow["diets"]),'reviewsURL':_itemRow["url"],'type':'R','tripAdvisorRating':_itemRow["review_score"],'usersMatchPercentage':"N/A",'img':getStockImage("seed",image)}
            restaurants.append(restaurant_dict)
            image +=1
        return restaurants

    def getSeedTTDs(self,ttdIDs):
        global ttds_data
        ttds = []
        image = 0
        for i in ttdIDs:
            _itemRow = ttds_data.loc[i]
            ttds_dict = {'isExpanded':0,'isLocked':0,'currentRating':0,'id':_itemRow["index"],'lat': _itemRow["lat"],'lon': _itemRow["lon"],'name':_itemRow["item_name"],'address':_itemRow["item_address"],'cats':ast.literal_eval(_itemRow["categories"]),'reviewsURL':_itemRow["url"],'type':'T','tripAdvisorRating':_itemRow["review_score"],'usersMatchPercentage':"N/A",'img':getStockImage("seed",image+6)}
            ttds.append(ttds_dict)
            image +=1
        return ttds

    

def object_decoder(obj):
    if 'py/object' in obj and obj['py/object'] == '__main__.Graph':
        return Graph(obj['nodes'])
    elif 'py/object' in obj and obj['py/object'] == '__main__.Node':
        return Node(obj['id'], obj['lat'], obj['lon'], obj['type'], obj['predicted_score'], obj['edges'], obj['estimatedCost'], obj['history'])
    elif 'py/object' in obj and obj['py/object'] == '__main__.Edge':
        return Edge(obj['id'], obj['destinationNodeID'], obj['sourceNodeID'], obj['length'], obj['speed'])
    
    return obj

def getStockImage(type,id):
    res_images = ["","","","","",""]
    res_images[0] = "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    res_images[1] = "https://images.unsplash.com/photo-1502301103665-0b95cc738daf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    res_images[2] = "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    res_images[3] = "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80"
    res_images[4] = "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80"
    res_images[5] = "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1385&q=80"

    ttd_images = ["","","","","",""]
    ttd_images[0] = "https://images.unsplash.com/photo-1416397202228-6b2eb5b3bb26?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80"
    ttd_images[1] = "https://images.unsplash.com/photo-1573155993874-d5d48af862ba?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
    ttd_images[2] = "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
    ttd_images[3] = "https://images.unsplash.com/photo-1508180588132-ec6ec3d73b3f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ttd_images[4] = "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ttd_images[5] = "https://images.unsplash.com/photo-1594182878451-6ed9c176c628?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1622&q=80"

    seed_images = ["","","","","","","","","","","",""]
    seed_images[0] = "https://media-cdn.tripadvisor.com/media/photo-p/15/a5/33/59/home-sweet-home.jpg"
    seed_images[1] = "http://www.shopbrockville.ca/microsite/photogallery/10218573.jpg"
    seed_images[2] = "https://media-cdn.tripadvisor.com/media/photo-s/13/44/cc/6b/the-perfect-combo.jpg"
    seed_images[3] = "https://10619-2.s.cdn12.com/rests/small/w312/h280/804_503070051.jpg"
    seed_images[4] = "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kMXJhbHNvZ25qbmczNy5jbG91ZGZyb250Lm5ldC80NmJmNzI1MS00MjYzLTQ1ZjQtOTljNy02YzUzMDM1MGFjYmIuanBlZw=="
    seed_images[5] = "https://media-cdn.tripadvisor.com/media/photo-p/13/d6/48/d5/photo4jpg.jpg"
    seed_images[6] = "https://globalnews.ca/wp-content/uploads/2020/07/eelld9bwaaqbmn3.jpg?quality=85&strip=all"
    seed_images[7] = "https://rcmusic-kentico-cdn.s3.amazonaws.com/rcm/media/main/about%20us/learning-rcs-about-building_1.png?ext=.png"
    seed_images[8] = "https://www.ctvnews.ca/polopoly_fs/1.3455943.1597670470!/httpImage/image.jpg_gen/derivatives/landscape_1020/image.jpg"
    seed_images[9] = "https://i.cbc.ca/1.5059493.1552750376!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_780/stephan-moccio-and-el-sistema.jpg"
    seed_images[10] = "https://media-cdn.tripadvisor.com/media/photo-s/0e/b4/c9/64/photo0jpg.jpg"
    seed_images[11] = "https://ontarioconservationareas.ca/images/banner_pg_fishing.jpg"

    
    if type == 'R':
        index = int(log(id, len(res_images)))
        return res_images[index]
    if type == 'T':
        index = int(log(id, len(res_images)))
        return ttd_images[index]
    if type == 'seed':
        return seed_images[id]