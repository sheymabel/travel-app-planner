import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import app, { db } from '../../configs/FirebaseConfig'; // Your Firebase config import
import { Colors } from '../../constants/Colors';

interface Service {
  id: string;
  title?: string;
  name?: string;
  imageUrl?: string;
}

const BusinessServicesScreen = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);
          setError(null);

          // Reference to user's services collection
          const servicesRef = collection(db, 'business', user.uid, 'services');
          const snapshot = await getDocs(servicesRef);

          const fetchedServices: Service[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Service[];

          setServices(fetchedServices);
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
    return (
      <TouchableOpacity
        style={imageStyles.imageContainer}
        onPress={() => handleServicePress(service)}
      >
        <Image
          source={{ uri: service.imageUrl || 'https://placehold.co/150x150/png' }}
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
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text>Loading services...</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[300],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray[900],
  },
  filterButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
});

export default BusinessServicesScreen;
