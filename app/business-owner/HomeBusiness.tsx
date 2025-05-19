import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {styles} from '../../src/styles/business-owner/homebusin'; // Import styles
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context'
const services = [
  {
    id: 1,
    title: 'Hair Styling',
    image: 'https://picsum.photos/200/300?random=1',
    duration: '1h 30m',
    price: '$75',
    rating: 4.9,
  },
  {
    id: 2,
    title: 'Manicure & Pedicure',
    image: 'https://picsum.photos/200/300?random=2',
    duration: '1h',
    price: '$45',
    rating: 4.8,
  },
  {
    id: 3,
    title: 'Professional Makeup',
    image: 'https://picsum.photos/200/300?random=3',
    duration: '2h',
    price: '$120',
    rating: 4.7,
  },
  {
    id: 4,
    title: 'Spa Treatment',
    image: 'https://picsum.photos/200/300?random=4',
    duration: '2h 30m',
    price: '$150',
    rating: 4.9,
  },
];

const BusinessServicesScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Our Services</Text>
          <TouchableOpacity>
            <Feather name="search" size={24} color={Colors.gray[600]} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {['All', 'Hair', 'Nails', 'Makeup', 'Spa'].map((category, index) => (
            <TouchableOpacity 
              key={index}
              style={[ 
                styles.categoryButton,
                index === 0 && styles.activeCategory,
              ]}
            >
              <Text style={[ 
                styles.categoryText,
                index === 0 && styles.activeCategoryText,
              ]}>
                {category}
              </Text>
              {index !== 0 && <Text style={styles.categoryCount}>({Math.floor(Math.random() * 15)})</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Services Grid */}
        <View style={styles.servicesContainer}>
          {services.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <TouchableOpacity style={styles.favoriteButton}>
                <Feather name="heart" size={20} color={Colors.white} />
              </TouchableOpacity>
              
              <Image
                source={{ uri: service.image }}
                style={styles.serviceImage}
                resizeMode="cover"
              />
              
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <View style={styles.serviceMeta}>
                  <Text style={styles.serviceDuration}>{service.duration}</Text>
                  <Text style={styles.servicePrice}>{service.price}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Feather name="star" size={16} color={Colors.black} />
                  <Text style={styles.ratingText}>{service.rating}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={24} color={Colors.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BusinessServicesScreen;
