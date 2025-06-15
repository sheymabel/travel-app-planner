import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig'; // your firebase config file
import { styles } from '../../src/styles/styles'; // your styles

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;

interface Business {
  id: string;
  name: string;
  location?: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  rating: number;
  businessId: string;
  business?: Business;
  isFavorite: boolean;
}

export default function TravlerServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchServicesWithBusinesses();
  }, []);

  const fetchServicesWithBusinesses = async () => {
    try {
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      const servicesData: Service[] = [];

      const businessIdsSet = new Set<string>();
      servicesSnapshot.forEach((doc) => {
        const data = doc.data();
        servicesData.push({
          id: doc.id,
          name: data.name,
          category: data.category,
          image: data.image,
          price: data.price,
          rating: data.rating || 0,
          businessId: data.businessId,
          isFavorite: false,
        });
        if (data.businessId) businessIdsSet.add(data.businessId);
      });

      // Fetch businesses by IDs
      const businessIds = Array.from(businessIdsSet);
      const businessesMap: Record<string, Business> = {};

      await Promise.all(
        businessIds.map(async (bid) => {
          const businessDoc = await getDoc(doc(db, 'business', bid));
          if (businessDoc.exists()) {
            businessesMap[bid] = {
              id: businessDoc.id,
              name: businessDoc.data().name,
              location: businessDoc.data().location,
            };
          }
        })
      );

      // Combine business info with services
      const combined = servicesData.map((service) => ({
        ...service,
        business: businessesMap[service.businessId],
      }));

      setServices(combined);
    } catch (error) {
      console.error('Error fetching services and businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, isFavorite: !service.isFavorite } : service
      )
    );
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ textAlign: 'center', marginTop: 10 }}>Loading services...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <Text style={styles.header}>Travler Services</Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              placeholder="Search services..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        style={{ marginTop: 10 }}
      >
        {filteredServices.length === 0 ? (
          <Text style={{ margin: 20, fontSize: 16 }}>No services found.</Text>
        ) : (
          filteredServices.map((service) => (
            <TouchableOpacity key={service.id} style={[styles.card, { width: CARD_WIDTH }]}>
              <Image
                source={{ uri: service.image }}
                style={[styles.cardImage, { width: CARD_WIDTH * 0.4 }]}
              />
              <View style={[styles.cardOverlay, { width: CARD_WIDTH * 0.6 }]}>
                <TouchableOpacity
                  style={styles.favoriteIcon}
                  onPress={() => toggleFavorite(service.id)}
                >
                  <MaterialIcons
                    name="favorite"
                    size={26}
                    color={service.isFavorite ? 'red' : '#ccc'}
                  />
                </TouchableOpacity>
                <Text style={styles.cardTitle}>{service.name}</Text>
                <Text style={styles.textCategory}>{service.category}</Text>
                <Text style={styles.cardText}>
                  Business: {service.business?.name ?? 'Unknown'}
                </Text>
                <View style={styles.cardBottomRow}>
                  <View style={styles.cardRating}>
                    <Text style={styles.cardRatingText}>{service.rating.toFixed(1)}</Text>
                    <Ionicons name="star" size={14} color="#FFD700" />
                  </View>
                  <Text style={styles.cardText}>from {service.price} DT</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
