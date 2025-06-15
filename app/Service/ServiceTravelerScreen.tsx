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
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../src/styles/business-owner/detils';



const { width } = Dimensions.get('window');


interface Business {
  id: string;
  name: string;
  city?: string;
  address?: string;
  phone?: string;
  profileImage?: string;
}

interface Service {
  serviceId: string;
  name: string;
  price: number;
  category?: string | null;
  description?: string;
  image?: string;
  rating?: number;
  isFavorite?: boolean;
  business: Business;
}
const BusinessCard = ({ service }: { service: Service }) => {
  if (!service.business) return null;

  const { name, address, phone, city, profileImage } = service.business;

  return (
    <View style={styleCard.card}>
      <Text style={styleCard.sectionTitle}>Creator :</Text>
      <View style={styleCard.row}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={styleCard.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styleCard.iconWrapper}>
            <Ionicons name="person" size={50} color="#6B7280" />
          </View>
        )}
        <View style={styleCard.info}>
          <Text style={styleCard.description}>{name}</Text>
          <Text style={styleCard.description}>{city}</Text>
          <Text style={styleCard.description}>{phone}</Text>

        </View>
      </View>
    </View>
  );
};
const ServiceTravelerScreen = () => {
  const { businessId, serviceId } = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();

  const getServiceById = async (businessId: string, serviceId: string): Promise<Service | null> => {
    const user = auth.currentUser;
    if (!user) {
      console.log('test')
      return null

    }
    const businessRef = doc(db, 'business', businessId);
    const businessSnap = await getDoc(businessRef);
    const favoritesSnapshot = await getDocs(
      query(collection(db, 'favorites'), where('travelerId', '==', user.uid))
    );
    const favoriteServiceIds = new Set(
      favoritesSnapshot.docs.map((doc) => doc.data().serviceId)
    );
    if (!businessSnap.exists()) return null;

    const businessData = businessSnap.data();

    const serviceRef = doc(db, 'business', businessId, 'services', serviceId);
    const serviceSnap = await getDoc(serviceRef);

    if (!serviceSnap.exists()) return null;

    const serviceData = serviceSnap.data();
    console.log('businessData', businessData)
    return {
      serviceId: serviceSnap.id,
      name: serviceData.name,
      price: serviceData.price,
      image: serviceData.imageUrl ?? '',
      category: serviceData.category ?? null,
      description: serviceData.description ?? '',
      rating: serviceData.rating ?? 1,
      isFavorite: favoriteServiceIds.has(serviceSnap.id),
      business: {
        id: businessId,
        name: businessData.fullName,
        city: businessData.city,
        address: businessData.address,
        phone: businessData.phone,
        profileImage: businessData.profileImage
          ? businessData.profileImage.startsWith('data:image/')
            ? businessData.profileImage
            : `data:image/png;base64,${businessData.profileImage}`
          : undefined,


      },
    };
  };
  useEffect(() => {
    const loadService = async () => {
      if (typeof businessId === 'string' && typeof serviceId === 'string') {
        const fetchedService = await getServiceById(businessId, serviceId);
        console.log('fetchedService', fetchedService)
        if (fetchedService) setService(fetchedService);
      }
      setLoading(false);
    };

    loadService();
  }, [businessId, serviceId]);

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

  const images = [service.image || service.image || 'https://placehold.co/600x400'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={{ width: 24 }} /> {/* For balance */}
        <TouchableOpacity style={styles.favoriteIcon} onPress={() => {
          // toggleFavorite(location.serviceId)
        }}>
          <MaterialIcons name="favorite" size={26} color={service.isFavorite ? "red" : "#ccc"} />
        </TouchableOpacity>
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
          <Text style={styles.title}>{service.name || 'Unnamed Service'}</Text>

          <View style={styles.detailsRow}>
            {service.price && (
              <View style={styles.detailContainer}>
                <Ionicons name="pricetag" size={16} color={Colors.primary} />
                <Text style={styles.detailValue}>${service.price}</Text>
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
          {service.business && (

            <BusinessCard service={service} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styleCard = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,


  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
});


export default ServiceTravelerScreen;