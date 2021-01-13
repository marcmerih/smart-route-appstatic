import pandas as pd
import numpy as np

# Item-Item Similarity Matrix - IxI
# User Rating Vector for Each User - UxI (1 x I)
# UxI : UxI mult IxI

ii_sim_restaurant_matrix = pd.read_csv('itemitem_restaurant_sim.csv')
ii_sim_hotel_matrix = pd.read_csv('itemitem_hotel_sim.csv')
ii_sim_ttd_matrix = pd.read_csv('itemitem_ttd_sim.csv')


class RecSys():

    def __init__(self):
        # Prediciton vectors where each value is a predicted rating (out of 5) for the user(s)
        self.restaurant_prediction_vector = []
        self.hotel_prediction_vector = []
        self.ttd_prediction_vector = []

    def predictRestaurantRatings(self, users):

        global ii_sim_hotel_matrix

        restaurant_prediction_vectors = []

        for user in users:
            ii_similarity = ii_sim_restaurant_matrix

            # train_matrix is built from user_rating_dictionary

            train_vector = np.zeros(len(ii_similarity))
            for item in user.restaurant_ratings.keys():
                item_id = int(item[1:])
                train_vector[item_id] = user.restaurant_ratings[item]

            # Initialize the predicted rating vector with zeros (# of Restaurants in DB)
            temp_vector = np.zeros(len(ii_similarity))

            # If been rated -> Set to 1, for the Normalizer not the predicted scores
            temp_vector[train_vector.nonzero()] = 1

            # UxI: UxI mul IxI -> 1xI: 1xI mul IxI -> Vector of len hotels
            normalizer = np.matmul(temp_vector, ii_similarity)

            normalizer[normalizer == 0] = 1e-5

            # UxI: UxI mul IxI -> 1xI: 1xI mul IxI -> Vector of len hotels
            predictionVetor = np.matmul(
                train_vector, ii_similarity)/normalizer

            restaurant_prediction_vectors.append(predictionVetor)
        self.restaurant_prediction_vector = self.multiplicativeUtility(
            restaurant_prediction_vectors)

    # Dictionary of Hotel-Rating Pair
    def predictHotelRatings(self, users):

        global ii_sim_hotel_matrix

        hotel_prediction_vectors = []

        for user in users:
            ii_similarity = ii_sim_hotel_matrix

            # train_matrix is built from user_rating_dictionary

            train_vector = np.zeros(len(ii_similarity))
            for item in user.hotel_ratings.keys():
                item_id = int(item[1:])
                train_vector[item_id] = user.hotel_ratings[item]

            # Initialize the predicted rating vector with zeros (# of Hotels in DB)
            temp_vector = np.zeros(len(ii_similarity))

            # If been rated -> Set to 1, for the Normalizer not the predicted scores
            temp_vector[train_vector.nonzero()] = 1

            # UxI: UxI mul IxI -> 1xI: 1xI mul IxI -> Vector of len hotels
            normalizer = np.matmul(temp_vector, ii_similarity)

            normalizer[normalizer == 0] = 1e-5

            # UxI: UxI mul IxI -> 1xI: 1xI mul IxI -> Vector of len hotels
            predictionVetor = np.matmul(
                train_vector, ii_similarity)/normalizer

            hotel_prediction_vectors.append(predictionVetor)
        self.hotel_prediction_vector = self.multiplicativeUtility(
            hotel_prediction_vectors)

    # Dictionary of TTD-Rating Pair
    def predictTTDRatings(self, users):

        global ii_sim_ttd_matrix

        ttd_prediction_vectors = []

        for user in users:
            ii_similarity = ii_sim_ttd_matrix

            # train_matrix is built from user_rating_dictionary

            train_vector = np.zeros(len(ii_similarity))
            for item in user.ttd_ratings.keys():
                item_id = int(item[1:])
                train_vector[item_id] = user.ttd_ratings[item]

            # Initialize the predicted rating vector with zeros (# of TTDs in DB)
            temp_vector = np.zeros(len(ii_similarity))

            # If been rated -> Set to 1, for the Normalizer not the predicted scores
            temp_vector[train_vector.nonzero()] = 1

            # UxI: UxI mul IxI -> 1xI: 1xI mul IxI -> Vector of len hotels
            normalizer = np.matmul(temp_vector, ii_similarity)

            normalizer[normalizer == 0] = 1e-5

            # UxI: UxI mul IxI -> 1xI: 1xI mul IxI -> Vector of len hotels
            predictionVetor = np.matmul(
                train_vector, ii_similarity)/normalizer

            ttd_prediction_vectors.append(predictionVetor)
        self.ttd_prediction_vector = self.multiplicativeUtility(
            ttd_prediction_vectors)

    def getRestaurantModel(self):
        return self.restaurant_prediction_vector

    def getHotelModel(self):
        return self.hotel_prediction_vector

    def getTTDModel(self):
        return self.ttd_prediction_vector

    def multiplicativeUtility(self, prediction_vectors):
        return np.divide(np.prod(np.vstack(prediction_vectors), axis=0), math.pow(5, (len(prediction_vectors)-1)))
