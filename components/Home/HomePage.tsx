import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CategoryButtons from '../Home/CategoryButtons';
import Listings from '../Home/Listings';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [listings] = useState([]); // This should be populated with your actual listings data

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Traveler!</Text>
          <Text style={styles.subtitle}>Where would you like to go?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <MaterialCommunityIcons name="account" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color={Colors.gray[500]} />
        <Text style={styles.searchText}>Search destinations...</Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <CategoryButtons onCagtegoryChanged={handleCategoryChange} />
      </View>

      {/* Listings Section */}
      <View style={styles.listingsContainer}>
        <Text style={styles.sectionTitle}>Popular in {selectedCategory}</Text>
        <Listings category={selectedCategory} listings={listings} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[500],
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  searchText: {
    marginLeft: 10,
    color: Colors.gray[500],
    fontSize: 16,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 15,
  },
  listingsContainer: {
    flex: 1,
    marginTop: 25,
    paddingHorizontal: 20,
  }
});

export default HomePage; 
