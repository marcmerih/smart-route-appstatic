import pandas as pd
import jsonpickle


usersData = pd.read_csv('data/user/users.csv')


class User():
    def __init__(self):

        self.username = ''
        self.password = ''

        self.restaurant_ratings = {}  # Dictionary of Restaurant-Rating Pair
        self.hotel_ratings = {}  # Dictionary of Hotel-Rating Pair
        self.ttd_ratings = {}  # Dictionary of ThingsToDo-Rating Pair

    def loadUser(self, username, password):
        global usersData

        userrow = usersData[(usersData['username'] ==
                             username) & (usersData['password'] == password)]

        if userrow.empty:
            return False

        self.username = userrow['username']
        self.password = userrow['password']

        # Properly load Dictionary

        self.restaurant_ratings = jsonpickle.decode(
            userrow['restaurant_ratings'].item())
        self.hotel_ratings = jsonpickle.decode(userrow['hotel_ratings'].item())
        self.ttd_ratings = jsonpickle.decode(userrow['ttd_ratings'].item())

    def checkUnique(self, username, password):
        global usersData

        userrow = usersData[(usersData['username'] ==
                             username) & (usersData['password'] == password)]

        if userrow.empty:
            return True
        else:
            return False

    def createUser(self, username, password):
        global usersData

        check = User()
        unique = check.checkUnique(username, password)

        if unique:
            self.username = username
            self.password = password
            self.saveUserInfo()

        else:
            print("Looks like there is already a user with that username. Try again.")

    def saveUserInfo(self):
        global usersData

        usersData.at[self.username, 'username'] = self.username
        usersData.at[self.username, 'password'] = self.password
        usersData.at[self.username, 'restaurant_ratings'] = jsonpickle.encode(
            self.restaurant_ratings)
        usersData.at[self.username, 'hotel_ratings'] = jsonpickle.encode(
            self.hotel_ratings)
        usersData.at[self.username, 'ttd_ratings'] = jsonpickle.encode(
            self.ttd_ratings)

        usersData.to_csv('data/users.csv', index=False)

    def setRestaurantRating(self, poi_type, poi_id, rating):
        restaurantID = poi_type + str(poi_id)
        self.restaurant_ratings[restaurantID] = rating
        self.saveUserInfo()

    def setHotelRating(self, poi_type, poi_id, rating):
        hotelID = poi_type + str(poi_id)
        self.hotel_ratings[hotelID] = rating
        self.saveUserInfo()

    def setTTDRating(self, poi_type, poi_id, rating):
        ttdID = poi_type + str(poi_id)
        self.ttd_ratings[ttdID] = rating
        self.saveUserInfo()
