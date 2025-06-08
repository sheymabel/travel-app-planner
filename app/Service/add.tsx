import { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { auth, db } from '../../configs/FirebaseConfig'; // adjust path as needed
import ServiceForm, { ServiceFormData } from './ServiceForm';
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
        return;
      }

      const businessDocRef = doc(db, 'business', user.uid);
      const businessDoc = await getDoc(businessDocRef);

      if (!businessDoc.exists()) {
        Alert.alert('Error', 'Business not found for this user.');
        return;
      }

      const businessId = businessDoc.id; // ✅ Use the document IDw

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price.toString());
      data.append('businessId', businessId);

      if (formData.category) {
        data.append('category', formData.category);
      }

      if (formData.image && formData.image.length > 0) {
  formData.image.forEach((img: any, index: number) => {
    const file = {
      uri: img.uri,
      name: img.fileName || `image_${index}.jpg`,
      type: img.type || 'image/jpeg',
    };

    data.append('images', file as any);
    console.log("Appending image:", file);
  });
}

      console.log("Submitting service with businessId:", businessId);

      const response = await axios.post('http://localhost:5000/api/service', data, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Service added successfully!');
      router.replace('/business-owner/BusinessServices');
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', error.response?.data?.errors?.[0] || 'Failed to add service.');
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

      <ServiceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </ScrollView>
  );
};

export default AddServiceScreen;
