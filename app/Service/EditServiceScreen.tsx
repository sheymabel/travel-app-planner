import { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ServiceForm from './ServiceForm'; // Update path if needed
import { styles } from '../../src/styles/business-owner/serviceStyles';

// Add FormData interface
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
      setTimeout(() => {
        setService({
          id: '#524587',
          name: 'Home Cleaner',
          description: 'Professional cleaning service',
          price: '89.99',
          duration: '1.5 hours',
          image: 'https://via.placeholder.com/150'
        });
      }, 500);
    };

    fetchService();
  }, [id]);

  // Add type annotation for formData
  const handleSubmit = async (formData: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Updating:', formData);
      router.back();
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
          onPress={() => router.replace('/')}
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