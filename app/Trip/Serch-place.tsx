import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  addDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Colors } from '../../constants/Colors';

interface City {
  city: string;
  governorate?: string;
  delegation?: string;
}

export default function SearchPlaceScreen() {
  const [searchText, setSearchText] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchCities = async (text: string) => {
    setSearchText(text);
    if (text.length < 2) return setCities([]);

    setLoading(true);
    try {
      const citiesRef = collection(db, 'cities');
      const q = query(
        citiesRef,
        orderBy('governorate'),
        startAt(text),
        endAt(text + '\uf8ff'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => doc.data() as City);
      setCities(results);
    } catch (error) {
      console.error('Erreur:', error);
      setCities([]);
    }
    setLoading(false);
  };

  const handleAddTrip = async (city: City) => {
    try {
      const user = getAuth().currentUser;
      if (!user) return Alert.alert('Non connecté');

      const tripRef = collection(db, 'Travler', user.uid, 'trip');
      const docRef = await addDoc(tripRef, {
        city: city.city,
        governorate: city.governorate || '',
        delegation: city.delegation || '',
      });

      const tripId = docRef.id;

      router.push({
        pathname: '/Trip/TravelingScreen',
        params: { tripId },
      });
    } catch (error) {
      console.error('Erreur ajout:', error);
      Alert.alert('Erreur', 'Impossible de créer le voyage');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Search Place</Text>

        {/* Input with search icon */}
        <View style={styles.inputWrapper}>
          <Ionicons name="search-outline" size={20} color={Colors.gray[500]} style={styles.searchIcon} />
          <TextInput
            placeholder="Search city or governorate..."
            value={searchText}
            onChangeText={searchCities}
            style={styles.inputSearch}
          />
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        <FlatList
          data={cities}
          keyExtractor={(item, index) => item.city + index}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cityCard}
              onPress={() => handleAddTrip(item)}
            >
              <Ionicons
                name="location-outline"
                size={22}
                color={Colors.primary}
                style={styles.icon}
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
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inner: {
    flex: 1,
    padding: 25,
    paddingTop: 55,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.gray[800],
    marginBottom: 16,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  inputSearch: {
    height: 50,
    borderColor: Colors.gray[300],
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 44, // space for icon
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    marginBottom: 10,
  },
  icon: {
    marginRight: 12,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[800],
  },
  cityDetails: {
    fontSize: 14,
    color: Colors.gray[500],
    marginTop: 2,
  },
});
