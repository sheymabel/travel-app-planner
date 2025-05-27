import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../src/styles/business-owner/homebusin';
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../configs/FirebaseConfig'; // ✅ Update path as needed

interface Service {
  id: string;
  title?: string;
  name?: string;
  image?: string;
  images?: string[];
  duration?: string;
  price?: string | number;
  rating?: number;
  businessId?: string;
}

const BusinessServicesScreen = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const auth = getAuth(app); // ✅ get auth instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);
          setError(null);

          const API_URL = `http://localhost:5000/api/service/business/${user.uid}`;
          const response = await axios.get<Service[]>(API_URL);

          setServices(response.data);
        } catch (err) {
          console.error('Error fetching services:', err);
          setError('Failed to load services. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('User not logged in.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleServicePress = (service: Service) => {
    router.push({
      pathname: '/Service/details',
      params: { serviceId: service.id },
    });
  };

  const renderServiceImage = ({ item: service }: { item: Service }) => {
    const imageUri = service.images?.[0] || service.image || 'https://placehold.co/150x150/png';

    return (
      <TouchableOpacity
        style={imageStyles.imageContainer}
        onPress={() => handleServicePress(service)}
      >
        <Image
          source={{ uri: imageUri }}
          style={imageStyles.serviceImage}
          resizeMode="cover"
        />
        <Text style={imageStyles.imageTitle} numberOfLines={1}>
          {service.title || service.name || 'Unnamed Service'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <TouchableOpacity>
          <Feather name="search" size={24} color={Colors.gray[600]} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderServiceImage}
        contentContainerStyle={imageStyles.gridContainer}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
            No services available.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => router.push('/Service/add')}
      >
        <Feather name="plus" size={24} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const imageStyles = StyleSheet.create({
  gridContainer: {
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    aspectRatio: 1,
  },
  imageTitle: {
    padding: 8,
    fontSize: 14,
    color: Colors.gray[800],
    textAlign: 'center',
  },
});

export default BusinessServicesScreen;
