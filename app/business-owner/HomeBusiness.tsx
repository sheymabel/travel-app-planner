import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BusinessServicesStyles from '../../src/styles/business-owner/BusinessServicesStyles.ts'; // Import styles
import { Colors } from '../../constants/Colors';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
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
    <SafeAreaView style={BusinessServicesStyles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={BusinessServicesStyles.scrollContainer}>
        {/* Header */}
        <View style={BusinessServicesStyles.header}>
          <Text style={BusinessServicesStyles.title}>Our Services</Text>
          <TouchableOpacity>
            <Feather name="search" size={24} color={Colors.gray[600]} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={BusinessServicesStyles.categoriesContainer}
        >
          {['All', 'Hair', 'Nails', 'Makeup', 'Spa'].map((category, index) => (
            <TouchableOpacity 
              key={index}
              style={[ 
                BusinessServicesStyles.categoryButton,
                index === 0 && BusinessServicesStyles.activeCategory,
              ]}
            >
              <Text style={[ 
                BusinessServicesStyles.categoryText,
                index === 0 && BusinessServicesStyles.activeCategoryText,
              ]}>
                {category}
              </Text>
              {index !== 0 && <Text style={BusinessServicesStyles.categoryCount}>({Math.floor(Math.random() * 15)})</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Services Grid */}
        <View style={BusinessServicesStyles.servicesContainer}>
          {services.map((service) => (
            <View key={service.id} style={BusinessServicesStyles.serviceCard}>
              <TouchableOpacity style={BusinessServicesStyles.favoriteButton}>
                <Feather name="heart" size={20} color={Colors.white} />
              </TouchableOpacity>
              
              <Image
                source={{ uri: service.image }}
                style={BusinessServicesStyles.serviceImage}
                resizeMode="cover"
              />
              
              <View style={BusinessServicesStyles.serviceDetails}>
                <Text style={BusinessServicesStyles.serviceTitle}>{service.title}</Text>
                <View style={BusinessServicesStyles.serviceMeta}>
                  <Text style={BusinessServicesStyles.serviceDuration}>{service.duration}</Text>
                  <Text style={BusinessServicesStyles.servicePrice}>{service.price}</Text>
                </View>
                <View style={BusinessServicesStyles.ratingContainer}>
                  <Feather name="star" size={16} color={Colors.black} />
                  <Text style={BusinessServicesStyles.ratingText}>{service.rating}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity style={BusinessServicesStyles.filterButton}>
          <Feather name="sliders" size={24} color={Colors.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BusinessServicesScreen;
