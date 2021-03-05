import pandas as pd
import jsonpickle


from django.http import HttpResponse, JsonResponse

usersData = pd.read_csv('data/user/users.csv')

def loadUsersData():
    global usersData
    usersData = pd.read_csv('data/user/users.csv')
    usersData["username"] = usersData["username"].astype(str)
    usersData["password"] = usersData["password"].astype(str)
    

class User():
    def __init__(self):

        self.username = ''
        self.password = ''
        self.trip = None
        self.restaurant_ratings = {}  # Dictionary of Restaurant-Rating Pair
        self.ttd_ratings = {}  # Dictionary of ThingsToDo-Rating Pair

    def loadUser(self, username, password,trip):
        global usersData
        loadUsersData()
        userrow = usersData[(usersData['username'] == username)]

        print(userrow)
    
        self.username = userrow['username']
        self.password = userrow['password']
        self.trip = trip
        # Properly load Dictionary
        self.restaurant_ratings = jsonpickle.decode(
            userrow['restaurant_ratings'].item())
        self.ttd_ratings = jsonpickle.decode(userrow['ttd_ratings'].item())
 

    def checkUnique(self, username, password):
        global usersData

        userrow = usersData[(usersData['username'] ==
                             username)]

        if userrow.empty:
            return True
        else:
            return False

    def createUser(self, username, password,trip):
        global usersData

        check = User()
        unique = check.checkUnique(username, password)

        if unique:
            self.username = str(username)
            self.password = str(password)
            self.trip = trip
            self.saveUserInfo()

        else:
            print("Looks like there is already a user with that username. Try again.")

    def saveUserInfo(self):
        global usersData

        usersData.at[str(self.username), 'username'] = str(self.username)
        usersData.at[str(self.username), 'password'] = str(self.password)
        usersData.at[str(self.username), 'restaurant_ratings'] = jsonpickle.encode(
            self.restaurant_ratings)
        usersData.at[str(self.username), 'ttd_ratings'] = jsonpickle.encode(
            self.ttd_ratings)

        usersData.to_csv('data/user/users.csv', index=False)

    def setItemRating(self, poi_type, poi_id, rating):
        ID = str(poi_id)
        if poi_type == 'R':
            self.restaurant_ratings[ID] = rating
        if poi_type == 'T':
            self.ttd_ratings[ID] = rating
        self.saveUserInfo()


    def getSeedPreferences(self):
        restaurants = self.trip.geographer.getSeedRestaurants(5)
        # restaurants = [
        #     {'id': '125','lat': '43.648505','lon': '-79.38668700000001','name': 'Tim Hortons','address': '123 Test Rd','resTags': '["Asian", "Buffet"]','cuisineOptions': '["Vegan"]','reviewsURL': "https://www.google.ca",'type':'res','tripAdvisorRating': '4.6','usersMatchPercentage': '5','img':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'},
        #     {'id': '122','lat': '46.648505','lon': '-81.38668700000001','name': 'Swiss Chalet','address': '123 Testing St','resTags': '["Asian", "Barbecue"]','cuisineOptions': '["Vegetarian"]','reviewsURL': "https://www.google.ca",'type':'res','tripAdvisorRating': '4.2','usersMatchPercentage': '5','img':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'},
        #     {'id': '112','lat': '41.648505','lon': '-91.38668700000001','name': 'Subway','address': '3 Court St','resTags': '["Fast Food", "Barbecue"]','cuisineOptions': '["Gluten Free"]','reviewsURL': "https://www.google.ca",'type':'res','tripAdvisorRating': '4.0','usersMatchPercentage': '5','img':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}
        # ]
        ttds = self.trip.geographer.getSeedTTDs(4)
        # ttds = [
        #     {'id': '125','lat': '43.648505','lon': '-79.38668700000001','name': 'Tim Hortons','address': '123 Test Rd','resTags': '["Asian", "Buffet"]','cuisineOptions': '["Vegan"]','reviewsURL': "https://www.google.ca",'type':'res','tripAdvisorRating': '4.6','usersMatchPercentage': '5','img':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'},
        #     {'id': '122','lat': '46.648505','lon': '-81.38668700000001','name': 'Swiss Chalet','address': '123 Testing St','resTags': '["Asian", "Barbecue"]','cuisineOptions': '["Vegetarian"]','reviewsURL': "https://www.google.ca",'type':'res','tripAdvisorRating': '4.2','usersMatchPercentage': '5','img':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'},
        #     {'id': '112','lat': '41.648505','lon': '-91.38668700000001','name': 'Subway','address': '3 Court St','resTags': '["Fast Food", "Barbecue"]','cuisineOptions': '["Gluten Free"]','reviewsURL': "https://www.google.ca",'type':'res','tripAdvisorRating': '4.0','usersMatchPercentage': '5','img':'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}
        # ]
        seedPreferences = {"restaurants":restaurants,"ttds":ttds}
        return seedPreferences
