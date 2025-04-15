import React, { useEffect, useContext } from 'react';
import { useNavigation } from 'expo-router';
import { View, StyleSheet } from 'react-native';
//import { GooglePlacesAutocomplete, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
//import { CreateTripContext } from './../../../context/CreateTripContext';

export default function SearchPlace() {
  const navigation = useNavigation();
 /* const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { tripData, setTripData } = useContext(CreateTripContext);
*/
  // Configuration du header lors du chargement du composant
  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerShown: true,
      headerTitle: 'Search Place',
    });
  }, []);

  // Extension du type GooglePlaceDetail pour inclure les champs supplémentaires
 /* type ExtendedPlaceDetails = GooglePlaceDetail & {
    photos?: { photo_reference: string }[];
    url?: string;
  };*/

  return (
    <View style={styles.container}>
      {/* Composant de recherche Google Places
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        fetchDetails={true} // Indique de récupérer les détails complets du lieu (nécessaire pour geometry, photos, etc.)
        onPress={(data, details = null) => {
          if (!details) return;

          const extendedDetails = details as ExtendedPlaceDetails;

          console.log(data.description); // Nom/description du lieu
          console.log(extendedDetails.geometry.location); // Latitude & longitude
          console.log(extendedDetails.photos?.[0]?.photo_reference); // Référence photo
          console.log(extendedDetails.url); // Lien Google Maps

          // Mise à jour du contexte global avec les données du lieu sélectionné
          setTripData({
            place: data.description,
            location: extendedDetails.geometry.location,
            photoReference: extendedDetails.photos?.[0]?.photo_reference || '',
            googleUrl: extendedDetails.url || '',
          });
        }}
        query={{
          key: GOOGLE_API_KEY, // Clé API Google
          language: 'en',      // Langue des résultats
        }}
        styles={{
          container: {
            flex: 0,
            zIndex: 1, // Important si d'autres composants se superposent
          },
          textInput: {
            height: 48,
            borderRadius: 8,
            paddingHorizontal: 16,
            fontSize: 16,
            backgroundColor: '#f0f0f0',
            margin: 16,
          },
        }}
        enablePoweredByContainer={false} // Cache le "Powered by Google"
        nearbyPlacesAPI="GooglePlacesSearch" // Utilise l'API de recherche des lieux à proximité
        debounce={200} // Réduit le nombre de requêtes envoyées lors de la saisie
      />
       */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
