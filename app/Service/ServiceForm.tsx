import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../src/styles/business-owner/serviceStyles';

// Define shared interface
export interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  image?: string;
}

interface ServiceFormProps {
  initialData?: ServiceFormData;
  onSubmit: (data: ServiceFormData) => void;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const ServiceForm = ({ 
  initialData, 
  onSubmit, 
  isSubmitting,
  isEditMode = false 
}: ServiceFormProps) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: initialData?.name || '',
    price: initialData?.price || '',
    duration: initialData?.duration || '',
    description: initialData?.description || '',
    image: initialData?.image || undefined
  });

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  // Rest of the component remains the same...
  // (Keep all the JSX code as is)
  return (
    <View style={styles.formContainer}>
      <TouchableOpacity 
        style={styles.imageUploadContainer}
        onPress={handleImagePick}
      >
        {formData.image ? (
          <Image 
            source={{ uri: formData.image }} 
            style={styles.imagePreview} 
          />
        ) : (
          <Ionicons name="image-outline" size={40} color="#9CA3AF" />
        )}
        <Text style={styles.imageUploadText}>
          {formData.image ? 'Change Image' : 'Upload Image'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.inputLabel}>Service Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter service name"
        value={formData.name}
        onChangeText={text => setFormData({ ...formData, name: text })}
      />

      <View style={styles.priceDurationRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Price ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={formData.price}
            onChangeText={text => setFormData({ ...formData, price: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Duration</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1.5 hours"
            value={formData.duration}
            onChangeText={text => setFormData({ ...formData, duration: text })}
          />
        </View>
      </View>

      <Text style={styles.inputLabel}>Description</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Describe your service..."
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={text => setFormData({ ...formData, description: text })}
      />

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
        onPress={() => onSubmit(formData)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isEditMode ? 'Update Service' : 'Create Service'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ServiceForm;