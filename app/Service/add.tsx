import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ServiceForm from './ServiceForm';
import { styles } from '../../src/styles/business-owner/serviceStyles';

// Add interface for form data
interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  image?: string;
}

const AddServiceScreen = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add type annotation for formData
  const handleSubmit = async (formData: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting:', formData);
      router.replace('/');
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
          onPress={() => router.replace('/')}
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