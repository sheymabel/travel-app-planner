import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, ImageBackground, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../src/styles/styles';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { Router } from 'react-router-dom';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.55;
const SMALL_CARD_WIDTH = width * 0.4;

  
const popularLocations1 = [
  { id: '1', name: 'Monastir', price: 689, rating: 4.9, image: 'https://images.unsplash.com/photo-1581015102891-1a16854854a7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '2', name: 'Tunis', price: 726, rating: null, image: 'https://images.unsplash.com/photo-1583253066701-c4f6e7f5439e?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '3', name: 'Sousse', price: 550, rating: 4.7, image: 'https://images.unsplash.com/photo-1604969774433-86bc8f4a1b5d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const popularLocations2 = [
  { id: '1', name: 'Bizerte', locations: 16, image: 'https://images.unsplash.com/photo-1604580863011-f41c0f5b8e1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '2', name: 'Aïn Draham', locations: 22, image: 'https://images.unsplash.com/photo-1517479149777-5f3b15118e8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '3', name: 'Sidi Bou Said', locations: 12, image: 'https://images.unsplash.com/photo-1580502377239-07ff586c056a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
useEffect(() => {
  navigation.setOptions({
    headerShown: false,
  });
}, []);
const checkLoginAndNavigate = async (path: '/sign-in' | '/sign-up' ) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    router.replace(path); // Navigate to destination if logged in
  } else {
    router.replace('/sign-in'); // Otherwise go to login
  }
};

const handlePress = () => {
  Alert.alert(
    "Access Restricted",
    "You must be signed in to access this feature.",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Sign In", onPress: () => router.replace('/sign-in') },
    ]
  );
};
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subHeader}>Find your next trip</Text>
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
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Popular locations</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
        >
          {popularLocations1.map((location) => (
            <TouchableOpacity key={location.id} style={[styles.card, { width: CARD_WIDTH }]}>
              <ImageBackground
                source={{ uri: location.image }}
                style={styles.cardImage}
                imageStyle={styles.cardImageStyle}
              >
                <View style={styles.cardOverlay}>
                  <Text style={styles.cardTitle}>{location.name}</Text>
                  <View style={styles.cardBottomRow}>
                    <Text style={styles.cardPrice}>from ${location.price}</Text>
                    {location.rating && (
                      <View style={styles.cardRating}>
                        <Text style={styles.cardRatingText}>{location.rating}</Text>
                        <Ionicons name="star" size={14} color="#FFD700" />
                      </View>
                    )}
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Popular locations</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
          snapToInterval={SMALL_CARD_WIDTH + 16}
          decelerationRate="fast"
        >
          {popularLocations2.map((location) => (
            <TouchableOpacity key={location.id} style={[styles.smallCard, { width: SMALL_CARD_WIDTH }]}>
              <ImageBackground
                source={{ uri: location.image }}
                style={styles.smallCardImage}
                imageStyle={styles.smallCardImageStyle}
              >
                <View style={styles.smallCardOverlay}>
                  <Text style={styles.smallCardTitle}>{location.name}</Text>
                  <Text style={styles.smallCardLocations}>{location.locations} locations</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Bottom Navigation with router navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} >
          <Ionicons name="home" size={26} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => checkLoginAndNavigate('/sign-in')}>
  <MaterialCommunityIcons name="image-multiple-outline" size={26} color="#8E8E93" />
</TouchableOpacity>

<TouchableOpacity style={styles.navItem} onPress={() => checkLoginAndNavigate('/sign-in')}>
  <MaterialCommunityIcons name="compass-outline" size={26} color="#8E8E93" />
</TouchableOpacity>

<TouchableOpacity style={styles.navItem} onPress={() => checkLoginAndNavigate('/sign-in')}>
  <MaterialCommunityIcons name="account-outline" size={26} color="#8E8E93" />
</TouchableOpacity>


      </View>
    </SafeAreaView>
  );
}
