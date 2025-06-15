import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../src/styles/business-owner/detils';

interface Service {
  id: string;
  title?: string;
  name?: string;
  image?: string;
  images?: string[];
  duration?: string;
  price?: string | number;
  rating?: number;
  description?: string;
  imageUrl?: string; // Added to align with other screens
}

const { width } = Dimensions.get('window');

const ServiceDetailsScreen = () => {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!serviceId) {
          setError('No service ID provided.');
          return;
        }

        const user = auth.currentUser;
        if (!user) {
          setError('User not authenticated.');
          return;
        }

        const serviceRef = doc(db, 'business', user.uid, 'services', serviceId);
        const serviceSnap = await getDoc(serviceRef);

        if (serviceSnap.exists()) {
          const data = serviceSnap.data() as Service;
          setService({
            id: serviceSnap.id,
            title: data.title,
            name: data.name,
            image: data.image,
            images: data.images,
            duration: data.duration,
            price: data.price,
            rating: data.rating,
            description: data.description,
            imageUrl: data.imageUrl || data.image || (data.images && data.images[0]), // Prioritize imageUrl
          });
        } else {
          setError('Service not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load service details.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !service) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error || 'Unknown error occurred.'}</Text>
      </SafeAreaView>
    );
  }

  const images = service.images?.length ? service.images : [service.imageUrl || service.image || 'https://placehold.co/600x400'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ width: 24 }} /> {/* For balance */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            )}
            onScroll={(e) => {
              const contentOffset = e.nativeEvent.contentOffset;
              const viewSize = e.nativeEvent.layoutMeasurement;
              const index = Math.floor(contentOffset.x / viewSize.width);
              setActiveImageIndex(index);
            }}
          />
          
          {/* Image indicators */}
          {images.length > 1 && (
            <View style={styles.indicatorContainer}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === activeImageIndex && styles.activeIndicator
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Service Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{service.title || service.name || 'Unnamed Service'}</Text>
          
          <View style={styles.detailsRow}>
            {service.price && (
              <View style={styles.detailContainer}>
                <Ionicons name="pricetag" size={16} color={Colors.primary} />
                <Text style={styles.detailValue}>${service.price}</Text>
              </View>
            )}
            
            {service.duration && (
              <View style={styles.detailContainer}>
                <Ionicons name="time" size={16} color={Colors.primary} />
                <Text style={styles.detailValue}>{service.duration}</Text>
              </View>
            )}
            
            {service.rating !== undefined && (
              <View style={styles.detailContainer}>
                <Ionicons name="star" size={16} color={Colors.primary} />
                <Text style={styles.detailValue}>{service.rating}/5</Text>
              </View>
            )}
          </View>
          
          {service.description && (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{service.description}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceDetailsScreen;