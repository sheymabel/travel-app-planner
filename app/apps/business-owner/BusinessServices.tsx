import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  Image, 
  Alert, 
  Animated 
} from 'react-native';
import {styles} from './styles'; // Import styles from a separate file
import { router } from 'expo-router';
import { Router } from 'react-router-dom';
const dummyServices = [
  {
    id: '1',
    name: 'Guided Medina Tour',
    description: 'A 3-hour tour of the historic Tunis Medina with a professional guide.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1589460953527-4b2b6b643f4d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Camel Ride at Sunset',
    description: 'Enjoy a magical camel ride in the Sahara dunes as the sun sets.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
  },
];

const BusinessServices = () => {
  const [services, setServices] = useState(dummyServices);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial fade value is 0

  // Trigger the fade-in animation when the component mounts
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Target opacity value
      duration: 500, // Duration of the animation
      useNativeDriver: true, // Use native driver for performance
    }).start();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this service?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => setServices(prev => prev.filter(service => service.id !== id)),
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={() => router.replace("./BusinessOwner/Service/EditService")}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Services</Text>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addText}>+ Add New Service</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#FF5722" />
      ) : (
        <FlatList
          data={services}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};


export default BusinessServices;
