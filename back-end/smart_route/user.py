import pandas as pd


users = pd.read_csv('users.csv')


class User():
    def __init__(self):

        self.username = ''
        self.password = ''

        self.restaurant_ratings = {}  # Dictionary of Restaurant-Rating Pair
        # Dictionary of Binary Restaurant-User Pairs where 1 -> Added, 0 -> Otherwise
        self.restaruants_added = {}

        self.hotel_ratings = {}  # Dictionary of Hotel-Rating Pair
        # Dictionary of Binary Hotel-User Pairs where 1 -> Added, 0 -> Otherwise
        self.hotels_added = {}

        self.ttd_ratings = {}  # Dictionary of ThingsToDo-Rating Pair
        # Dictionary of Binary ThingsToDo-User Pairs where 1 -> Added, 0 -> Otherwise
        self.ttds_added = {}

    def loadUser(self, username, password):
        global users

        userrow = users[users['username'] ==
                        username & users['password'] == password]

        if userrow == None:
            return 0

        self.username = userrow[0]
        self.password = userrow[1]

        # Properly load Dictionary somehow
        self.restaurant_ratings = userrow[2]
        self.restaruants_added = userrow[3]
        self.hotel_ratings = userrow[4]
        self.hotels_added = userrow[5]
        self.ttd_ratings = userrow[6]
        self.ttds_added = userrow[7]

        return 1

    def createUser(self, username, password):

        global users

        self.username = username
        self.password = password
        self.saveUserInfo

    def saveUserInfo(self):
        global users

        users.set_value(self.username, 'username', self.username)
        users.set_value(self.username, 'password', self.password)
        users.set_value(self.username, 'restaurant_ratings',
                        self.restaurant_ratings)
        users.set_value(self.username, 'restaruants_added',
                        self.restaruants_added)
        users.set_value(self.username, 'hotel_ratings', self.hotel_ratings)
        users.set_value(self.username, 'hotels_added', self.hotels_added)
        users.set_value(self.username, 'ttd_ratings', self.ttd_ratings)
        users.set_value(self.username, 'ttds_added', self.ttds_added)

        users.to_csv('users.csv', index=False)

    def setRestaruantRating(self, restaurantID, rating):
        self.restaurant_ratings[restaurantID] = rating
        self.saveUserInfo

    def setHotelRating(self, hotelID, rating):
        self.hotel_ratings[hotelID] = rating
        self.saveUserInfo

    def setTTDRating(self, ttdID, rating):
        self.ttd_ratings[ttdID] = rating
        self.saveUserInfo
