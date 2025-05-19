import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../src/styles/business-owner/serviceStyles';

interface ServiceFormProps {
  initialData?: {
    name: string;
    description: string;
    price: string;
    duration: string;
    image?: string;
  };
  onSubmit: (data: ServiceFormData) => void;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

export interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  image?: string;
}
// In ServiceForm.tsx
interface ServiceFormProps {
  onSubmit: (data: ServiceFormData) => void;
  isSubmitting: boolean;
  initialData?: ServiceFormData;
  isEditMode?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting,
  isEditMode = false 
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: initialData?.name || '',
    price: initialData?.price || '',
    duration: initialData?.duration || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
  });

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload images!');
      return;
    }

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

  return (
    <View style={styles.formContainer}>
      {/* Image Upload Section */}
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
          {formData.image ? 'Change Image' : 'Upload Service Image'}
        </Text>
      </TouchableOpacity>

      {/* Service Name Input */}
      <Text style={styles.inputLabel}>Service Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter service name"
        value={formData.name}
        onChangeText={text => setFormData({ ...formData, name: text })}
      />

      {/* Price & Duration Row */}
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

      {/* Description Input */}
      <Text style={styles.inputLabel}>Description</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Describe your service..."
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={text => setFormData({ ...formData, description: text })}
      />

      {/* Submit Button */}
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