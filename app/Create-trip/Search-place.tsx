import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation } from 'expo-router';
import Constants from 'expo-constants';
import { FontAwesome } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function SearchPlace() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const MAPBOX_ACCESS_TOKEN = Constants.expoConfig?.extra?.MAPBOX_TOKEN;

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerShown: true,
      headerTitle: 'Search Place',
    });
  }, []);

  const searchPlace = async (text: string) => {
    setQuery(text);
    if (text.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
          text
        )}&limit=5&country=TN&access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();
      setResults(data.features || []);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <FontAwesome name="search" size={20} color="#aaa" />
        <TextInput
          placeholder="Search for a place in Tunisia"
          value={query}
          onChangeText={searchPlace}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animatable.View
            animation="fadeInUp"
            duration={500}
            style={styles.resultItem}
          >
            <TouchableOpacity onPress={() => console.log(item)} style={styles.touchable}>
              <FontAwesome name="map-marker" size={20} color="#ff5733" />
              <Text style={styles.placeName}>{item.place_name}</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 70,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  resultItem: {
    paddingHorizontal: 16,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  placeName: {
    fontSize: 16,
    color: '#222',
  },
});
