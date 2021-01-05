import pandas as pd

# Item-Item Similarity Matrix - IxI
# User Rating Vector for Each User - UxI (1 x I)
# UxI : UxI mult IxI

ii_sim_restaurant_matrix = pd.read_csv('itemitem_restaurant_sim.csv')
ii_sim_hotel_matrix = pd.read_csv('itemitem_hotel_sim.csv')
ii_sim_ttd_matrix = pd.read_csv('itemitem_ttd_sim.csv')


class RecSys():

    self.restaurant_model  # Prediction Matrix:  -> Vector of len restaurants
    self.restaurant_model  # Prediction Matrix:  -> Vector of len restaurants
    self.restaurant_model  # Prediction Matrix:  -> Vector of len restaurants

    # Dictionary of Restaurant-Rating Pair
    def predictUserRestaurantRatings(user_rating_dictionary):

        global ii_sim_restaurant_matrix

        ii_similarity = ii_sim_restaurant_matrix

        # train_matrix is built from user_rating_dictionary

        train_vector = np.zeros(len(ii_similarity))
        for item in user_rating_dictionary.keys():
            train_vector[item-1] = user_rating_dictionary[item]

        # Initialize the predicted rating vector with zeros (# of Restaurants in DB)
        temp_vector = np.zeros(len(ii_similarity))

        # If been rated -> Set to 1, for the Normalizer not the predicted scores
        temp_vector[train_vector.nonzero()] = 1

        # UxI: UxI mul IxI -> 1xI: 1xI mul IxI -> Vector of len restaurants
        normalizer = np.matmul(temp_vector, ii_similarity)

        normalizer[normalizer == 0] = 1e-5

        # UxI: UxI mul IxI -> 1xI: 1xI mul IxI -> Vector of len restaurants
        predictionMatrix = np.matmul(train_vector, ii_similarity)/normalizer

        self.restaurant_model = predictionMatrix

    def getRestaurantModel(self):
        return self.restaurant_model
