import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { db } from '../../configs/FirebaseConfig';
import {
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  limit,
  getDocs,
} from 'firebase/firestore';

interface City {
  id: string;
  city: string;
  governorate?: string;
  delegation?: string;
}

const dummyResults = [
  { id: '1', title: 'Tunis' },
  { id: '2', title: 'Sidi Bou Said' },
  { id: '3', title: 'Djerba' },
  { id: '4', title: 'Tozeur' },
];

const ScreenSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState(dummyResults);
  const [firebaseResults, setFirebaseResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (text: string) => {
    setSearchText(text);

    // Filter dummy data locally immediately
    const filtered = dummyResults.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);

    if (text.length >= 2) {
      setLoading(true);
      try {
        const citiesRef = collection(db, 'cities');
        const q = query(
          citiesRef,
          orderBy('city'),
          startAt(text),
          endAt(text + '\uf8ff'),
          limit(20)
        );
   const snapshot = await getDocs(q);
const firebaseData = snapshot.docs.map((doc) => {
  const data = doc.data();
  const { id, ...rest } = data as any; // évite la duplication de la clé id
  return {
    id: doc.id,
    ...rest,
  };
});
setFirebaseResults(firebaseData);
      } catch (error) {
        console.error('Firebase search error:', error);
        setFirebaseResults([]);
      }
      setLoading(false);
    } else {
      setFirebaseResults([]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search destination..."
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* Show dummy filtered results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.resultItem}>{item.title}</Text>
        )}
        ListHeaderComponent={<Text style={styles.header}>Dummy Results</Text>}
        keyboardShouldPersistTaps="handled"
      />

      {/* Show loading spinner for Firebase search */}
      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      {/* Show Firestore city search results */}
      <FlatList
        data={firebaseResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cityCard}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#007AFF"
              style={{ marginRight: 12 }}
            />
            <View>
              <Text style={styles.cityName}>
                {item.delegation || item.city}
              </Text>
              <Text style={styles.cityDetails}>
                {item.city} • {item.governorate || 'Unknown'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          firebaseResults.length > 0 ? (
            <Text style={styles.header}>Firestore Cities</Text>
          ) : null
        }
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default ScreenSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    padding: 10,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  resultItem: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    marginTop: 12,
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
  },
  cityDetails: {
    fontSize: 14,
    color: '#666',
  },
});
