import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { styles } from './../../app/apps/Create-trip/Mapboxstyles'; // ✅ Updated

interface SearchResultItem {
  place_name: string;
  geometry: {
    coordinates: [number, number];
  };
}

// ✅ Remove invalid legacy line
// MapboxGL.setConnected(true);

// ✅ Set access token
MapboxGL.setAccessToken(Constants.expoConfig?.extra?.MAPTILER_KEY || '');

const SearchResult: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const maptilerKey = Constants.expoConfig?.extra?.MAPTILER_KEY;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation([location.coords.longitude, location.coords.latitude]);
    })();
  }, []);

  const searchPlaces = async () => {
    if (!searchText) return;
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/v5/maptiler.places/${encodeURIComponent(searchText)}.json?country=TN&limit=5&key=${maptilerKey}`
      );
      const data = await response.json();
      setSearchResults(data.features);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter a place (e.g. Tunis)"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title="Search" onPress={searchPlaces} />
      </View>

      <MapboxGL.MapView
        style={styles.map}
        styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerKey}`}
      >
        {userLocation && (
          <MapboxGL.Camera
            zoomLevel={10}
            centerCoordinate={userLocation}
          />
        )}

        {userLocation && (
          <MapboxGL.PointAnnotation id="user-location" coordinate={userLocation}>
            <View style={styles.userMarker} />
          </MapboxGL.PointAnnotation>
        )}

        {searchResults.map((result, index) => (
          <MapboxGL.PointAnnotation
            key={`place-${index}`}
            id={`place-${index}`}
            coordinate={result.geometry.coordinates}
          >
            <View style={styles.searchMarker} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>

      <ScrollView style={styles.resultsList}>
        {searchResults.map((res, idx) => (
          <Text key={idx} style={styles.resultItem}>{res.place_name}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchResult;
