import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SearchPlace() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add a loading state

  // Function to fetch geocoding results
  const fetchPlaces = async () => {
    if (!searchText.trim()) return; // Avoid empty search requests

    setLoading(true);  // Set loading to true when fetch starts
    setError(null);  // Reset any previous errors

    const fetchPlaces = async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${searchText}&format=json`;
        const response = await fetch(url);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        setError('Failed to fetch places');
      }
    };
    

  useEffect(() => {
    // If searchText is empty, clear the results
    if (!searchText) {
      setResults([]);
    }
  }, [searchText]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a place"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={fetchPlaces} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />} {/* Loading indicator */}

      {error && <Text style={styles.error}>{error}</Text>}

      {results.length > 0 && (
        <View style={styles.results}>
          {results.map((place, index) => (
            <Text key={index}>{place.place_name}</Text>  // Render place name
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  results: {
    marginTop: 20,
  },
});
}
