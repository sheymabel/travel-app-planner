import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useRouter } from 'expo-router';

interface City {
  id: string;
  city: string;
  code: string;
  country: string;
  delegation: string;
  governorate: string;
  latitude: string;
  longitude: string;
}

export default function SearchPlace() {
  const [searchText, setSearchText] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      if (searchText.trim().length === 0) {
        setCities([]);
        return;
      }

      try {
        const citiesRef = collection(db, 'cities');
        const snapshot = await getDocs(citiesRef);
        const results: City[] = [];

        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          if (data.city?.toLowerCase().includes(searchText.toLowerCase())) {
            results.push({
              id: doc.id,
              city: data.city,
              code: data.code,
              country: data.country,
              delegation: data.delegation,
              governorate: data.governorate,
              latitude: data.latitude,
              longitude: data.longitude,
            });
          }
        });

        setCities(results);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      }
    }

    fetchCities();
  }, [searchText]);

  const checkLoginAndNavigate = (route: string) => {
    if (isLoggedIn) {
      router.replace('/sign-in');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>City Explorer</Text>
        <Text style={styles.subtitle}>Find locations worldwide</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={22} color="#6B7280" />
          <TextInput
            placeholder="Search city or region..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.filterButton}>
            <MaterialCommunityIcons name="tune" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Results Section */}
      <ScrollView style={styles.resultsContainer}>
        {cities.length > 0 ? (
          cities.map(city => (
            <View key={city.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.locationIcon}>
                  <Ionicons name="location-sharp" size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.cityName}>{city.city}</Text>
                  <Text style={styles.countryText}>{city.country}</Text>
                </View>
                <Text style={styles.codeBadge}>{city.code}</Text>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Governorate</Text>
                  <Text style={styles.detailValue}>{city.governorate}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Delegation</Text>
                  <Text style={styles.detailValue}>{city.delegation}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="map" size={48} color="#E5E7EB" />
            <Text style={styles.emptyText}>Search to discover cities</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => checkLoginAndNavigate('Home')}
        >
          <Ionicons name="home" size={26} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => checkLoginAndNavigate('Gallery')}
        >
          <MaterialCommunityIcons
            name="image-multiple-outline"
            size={26}
            color="#8E8E93"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => checkLoginAndNavigate('Explore')}
        >
          <MaterialCommunityIcons
            name="compass-outline"
            size={26}
            color="#8E8E93"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => checkLoginAndNavigate('Profile')}
        >
          <MaterialCommunityIcons
            name="account-outline"
            size={26}
            color="#8E8E93"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    marginLeft: 8,
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    marginRight: 12,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  countryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  codeBadge: {
    marginLeft: 'auto',
    backgroundColor: '#EFF6FF',
    color: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    alignItems: 'center',
  },
});
