import { Text, View, TextInput, ScrollView, Image, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { styles } from '../../src/styles/styles';
import { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { getAuth } from '@firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.89;





interface Business {
  id: string;
  name: string;
  city?: string;
  address?: string;
  phone?: string;
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

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [serviceList, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchText, setSearchText] = useState('');

  const [loading, setLoading] = useState(true);

  // const toggleFavorite = (id: string) => {
  //   const updated = services.map((service) =>
  //     service.id === id
  //       ? { ...service, isFavoite: !service.isFavoite }
  //       : service
  //   );
  //   setServices(updated);
  // };
  // () => 
  const getAllServicesWithBusiness = async (): Promise<Service[]> => {
    const businessSnapshot = await getDocs(collection(db, 'business'));
    let servicesWithBusiness: Service[] = [];

    for (const businessDoc of businessSnapshot.docs) {
      const businessId = businessDoc.id;
      const businessData = businessDoc.data();

      const servicesSnapshot = await getDocs(collection(db, 'business', businessId, 'services'));

      for (const serviceDoc of servicesSnapshot.docs) {
        const serviceData = serviceDoc.data();

        servicesWithBusiness.push({
          serviceId: serviceDoc.id,
          name: serviceData.name,
          price: serviceData.price,
          image: serviceData.imageUrl ?? '',
          category: serviceData.category ?? null,
          description: serviceData.description ?? '',
          rating: serviceData.rating ?? 1,
          isFavorite: false,
          business: {
            id: businessId,
            name: businessData.name,
            city: businessData.city,
            phone:businessData.phone,
          },
        });
      }


    }

    return servicesWithBusiness;
  };
  const selectedService = (businessId:string,serviceId: string) => {

  router.push(`/Service/ServiceTravelerScreen?businessId=${businessId}&serviceId=${serviceId}`);

  }

  const onSearchPress = () => {
    const filtered = serviceList.filter(service =>
      service.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredServices(filtered);
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
    setLoading(true)
    getAllServicesWithBusiness().then((services) => {

      setServices(services)
      setFilteredServices(services);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);

    })
  }, []);
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Nordic scenery</Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <TouchableOpacity onPress={onSearchPress}>
              <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            </TouchableOpacity>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
          </View>
        </View>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
          decelerationRate="fast"
        >

          {filteredServices.map((location) => (
            <TouchableOpacity key={location.serviceId} onPress={() => selectedService(location.business.id,location.serviceId)} style={[styles.card, { width: CARD_WIDTH }]}>
              <Image
                source={{ uri: location.image }}
                style={[styles.cardImage, { width: CARD_WIDTH * 0.40 }]}
              />
              <View style={[styles.cardOverlay, { width: CARD_WIDTH * 0.60 }]}>
                <TouchableOpacity style={styles.favoriteIcon} onPress={() => {
                  // toggleFavorite(location.serviceId)
                }}>
                  <MaterialIcons name="favorite" size={26} color={location.isFavorite ? "red" : "#ccc"} />
                </TouchableOpacity>

                <Text style={styles.cardTitle}>{location.name}</Text>

                <Text style={styles.textCategory}>{location.category}</Text>

                {/* Replace createur with business name or owner */}
                <Text style={styles.cardText}>{location.business?.name}</Text>

                <View style={styles.cardBottomRow}>
                  {location.rating && (
                    <View style={styles.cardRating}>
                      <Text style={styles.cardRatingText}>{location.rating}</Text>
                      <Ionicons name="star" size={14} color="#FFD700" />
                    </View>
                  )}
                  <Text style={styles.cardText}>from {location.price} DT</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>)

}