import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfig'; // adjust path if needed
import ServiceForm from './ServiceFormm'; // Update path if needed
import { styles } from '../../src/styles/business-owner/serviceStyles';

interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  image?: string;
}

interface ServiceData extends ServiceFormData {
  id: string;
}

const EditServiceScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [service, setService] = useState<ServiceData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !id) return;

        const serviceRef = doc(db, 'business', user.uid, 'services', id as string);
        const docSnap = await getDoc(serviceRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setService({
            id: docSnap.id,
            name: data.name || '',
            description: data.description || '',
            price: data.price ? data.price.toString() : '0',
            duration: data.duration || '',
            image: data.image || (data.images && data.images[0]) || 'https://via.placeholder.com/150',
          });
        } else {
          console.warn('No such service found!');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (formData: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user || !id) return;

      const serviceRef = doc(db, 'business', user.uid, 'services', id as string);

      await updateDoc(serviceRef, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: formData.duration,
        image: formData.image || '', // update image or keep empty
      });

      router.replace('/business-owner/BusinessServices');
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons 
          name="arrow-back" 
          size={24} 
          onPress={() => router.replace('/business-owner/BusinessServices')}
          color="#374151"
        />
        <Text style={styles.headerTitle}>Edit Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ServiceForm 
        initialData={service}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEditMode
      />
    </ScrollView>
  );
};

export default EditServiceScreen;
