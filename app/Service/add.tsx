import { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { auth, db } from '../../configs/FirebaseConfig'; // adjust path if needed
import ServiceForm, { ServiceFormData } from './ServiceForm'; // Your custom form
import { styles } from '../../src/styles/business-owner/serviceStyles';

const AddServiceScreen = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to add a service.');
        setIsSubmitting(false);
        return;
      }

      // Step 1: Get businessId from Firestore
      const businessDocRef = doc(db, 'business', user.uid);
      const businessDoc = await getDoc(businessDocRef);
      if (!businessDoc.exists()) {
        Alert.alert('Error', 'Business not found for this user.');
        setIsSubmitting(false);
        return;
      }
      const businessId = businessDoc.data()?.businessId;

      // Step 2: Prepare multipart/form-data
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price.toString());
      data.append('businessId', businessId);

      // Step 3: Add image(s)
      if (formData.image && formData.image.length > 0) {
        formData.image.forEach((img: any, index: number) => {
          data.append('images', {
            uri: img.uri,
            name: img.fileName || `image_${index}.jpg`,
            type: img.type || 'image/jpeg',
          } as any);
        });
      }

      // Step 4: Send to backend API using Axios
      const response = await axios.post('http://localhost:5000/api/service', data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data', // Axios will set proper boundaries automatically
        },
      });

      Alert.alert('Success', 'Service added successfully!');
      router.replace('/business-owner/BusinessServices');
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons 
          name="arrow-back" 
          size={24} 
          onPress={() => router.replace('/business-owner/BusinessServices')}
          color="#374151"
        />
        <Text style={styles.headerTitle}>New Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ServiceForm
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
      />
    </ScrollView>
  );
};

export default AddServiceScreen;
