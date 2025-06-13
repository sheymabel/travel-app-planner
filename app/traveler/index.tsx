import {  Text, View, TextInput, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { styles } from '../../src/styles/styles';
import { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.89;
const CARD_WIDTH = width * 0.89;

const SMALL_CARD_WIDTH = width * 0.4;


const services = [
  {
    id: '1',
    category: 'Tour',
    image: 'https://res.cloudinary.com/dpelvamn2/image/upload/v1747917024/service_images/rnckmcuneb0jrtilavum.jpg',
    name: 'My Service Name',
    price: 25,
    createur: 'Amine Bacar',
    rating: 4.52,
    isFavoite: false,
  },
  {
    id: '2',
    category: 'Tour',
    image: 'https://res.cloudinary.com/dpelvamn2/image/upload/v1747917024/service_images/rnckmcuneb0jrtilavum.jpg',
    name: 'City Explorer',
    price: 30,
    createur: 'Amine Bacar',
    rating: 4.78,
    isFavoite: true,
  },
  {
    id: '3',
    category: 'Tour',
    image: 'https://res.cloudinary.com/dpelvamn2/image/upload/v1747917024/service_images/rnckmcuneb0jrtilavum.jpg',
    name: 'Desert Safari',
    price: 45,
    createur: 'Amine Bacar',
    rating: 4.9,
    isFavoite: false,
  },
  {
    id: '4',
    category: 'Tour',
    image: 'https://res.cloudinary.com/dpelvamn2/image/upload/v1747917024/service_images/rnckmcuneb0jrtilavum.jpg',
    name: 'Historic Walk',
    price: 20,
    createur: 'Amine Bacar',
    rating: 4.2,
    isFavoite: false,
  },
  {
    id: '5',
    category: 'Tour',
    image: 'https://res.cloudinary.com/dpelvamn2/image/upload/v1747917024/service_images/rnckmcuneb0jrtilavum.jpg',
    name: 'Nature Hike',
    price: 35,
    createur: 'Amine Bacar',
    rating: 4.7,
    isFavoite: true,
  },
  {
    id: '6',
    category: 'Tour',
    image: 'https://res.cloudinary.com/dpelvamn2/image/upload/v1747917024/service_images/rnckmcuneb0jrtilavum.jpg',
    name: 'Museum Pass',
    price: 18,
    createur: 'Amine Bacar',
    rating: 4.4,
    isFavoite: false,
  },
]
export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [serviceList, setServices] = useState(services)
  const toggleFavorite = (id: string) => {
    const updated = services.map((service) =>
      service.id === id
        ? { ...service, isFavoite: !service.isFavoite }
        : service
    );
    setServices(updated);
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
  }
    , []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Nordic scenery</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
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
          {serviceList.map((location) => (
            <TouchableOpacity key={location.id} style={[styles.card, { width: CARD_WIDTH }]}>

              <Image
                source={{ uri: location.image }}
                style={[styles.cardImage, { width: CARD_WIDTH * 0.40 }]}
              >
              </Image>
              <View style={[styles.cardOverlay, { width: CARD_WIDTH * 0.60 }]}>
                <TouchableOpacity style={styles.favoriteIcon} onPress={() => toggleFavorite(location.id)}>
                  <MaterialIcons name="favorite" size={26} color={location.isFavoite ? "red" : "#ccc"} />
                </TouchableOpacity>
                <Text style={styles.cardTitle}>{location.name}</Text>
                <Text style={[styles.textCategory]}> {location.category}</Text>
                <Text style={styles.cardText} >{location.createur}</Text>
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
    </SafeAreaView>)}