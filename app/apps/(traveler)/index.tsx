import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
export default function TravelerHome() {
  const navigation = useNavigation();
  const router = useRouter();

useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
   
    });
  }
  , []);




  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome Traveler!</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#64748b" />
            <Text style={styles.searchText}>Search destinations...</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destinationsScroll}>
            {['Beach', 'Mountain', 'City', 'Countryside'].map((destination, index) => (
              <TouchableOpacity key={index} style={styles.destinationCard}>
                <View style={styles.destinationIcon}>
                  <Ionicons 
                    name={destination === 'Beach' ? 'water-outline' : 
                          destination === 'Mountain' ? 'location-outline' : 
                          destination === 'City' ? 'business-outline' : 'leaf-outline'} 
                    size={24} 
                    color="#4f46e5" 
                  />
                </View>
                <Text style={styles.destinationText}>{destination}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Trips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Trips</Text>
          <View style={styles.tripCard}>
            <Text style={styles.noTripsText}>No upcoming trips planned</Text>
            <TouchableOpacity style={styles.planTripButton}>
              <Text style={styles.planTripButtonText}>Plan a Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  notificationButton: {
    padding: 8,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchText: {
    marginLeft: 8,
    color: '#64748b',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  destinationsScroll: {
    flexDirection: 'row',
  },
  destinationCard: {
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  destinationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  destinationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  tripCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  noTripsText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  planTripButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  planTripButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
