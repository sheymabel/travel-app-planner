import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { auth, db } from '../../configs/FirebaseConfig';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { styles } from '../../src/styles/business-owner/serviceStyles';
import { Colors } from '../../constants/Colors';

const categories = ['Utilitarian', 'Aesthetic', 'Artistic', 'Cultural', 'Traditional'];

const showToast = (type: 'success' | 'error', message: string) => {
  Toast.show({
    type,
    text1: message,
    position: 'bottom',
    visibilityTime: 3000,
  });
};

const AddServiceScreen = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUri: null as string | null,
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true, // Enable base64 output
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFormData({ ...formData, imageUri: base64Image });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.price.trim() || !formData.category) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Please enter a valid price (greater than 0)');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        showToast('error', 'You must be logged in');
        return;
      }

      // Verify business exists
      const businessDoc = await getDoc(doc(db, 'business', user.uid));
      if (!businessDoc.exists()) {
        showToast('error', 'Business profile not found');
        return;
      }

      // Add service to Firestore with base64 image
      await addDoc(collection(db, 'business', user.uid, 'services'), {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: price,
        category: formData.category,
        imageUrl: formData.imageUri || '',
      });

      showToast('success', 'Service added successfully!');
      
      // Reset form and navigate
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUri: null,
      });
      router.replace('/business-owner/BusinessServices');
    } catch (error) {
      console.error('Error:', error);
      showToast('error', 'Failed to add service');
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}></Text>
      </View>

      {/* Image Upload */}
      <TouchableOpacity 
        style={styles.imageUploadContainer} 
        onPress={pickImage}
        disabled={isSubmitting}
      >
        {formData.imageUri ? (
          <Image source={{ uri: formData.imageUri }} style={styles.imagePreview} />
        ) : (
          <View>
            <Ionicons name="image-outline" size={40} color="#9CA3AF" />
            <Text style={styles.imageUploadText}>Upload Image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Service Name */}
      <Text style={styles.inputLabel}>Service Name*</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter service name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        editable={!isSubmitting}
      />

      {/* Price */}
      <Text style={styles.inputLabel}>Price*</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="0.00"
        value={formData.price}
        onChangeText={(text) => setFormData({ ...formData, price: text })}
        editable={!isSubmitting}
      />

      {/* Category */}
      <Text style={styles.inputLabel}>Category*</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          enabled={!isSubmitting}
        >
          <Picker.Item label="Select category" value="" />
          {categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>

      {/* Description */}
      <Text style={styles.inputLabel}>Description*</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Describe your service..."
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        editable={!isSubmitting}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Create Service</Text>
        )}
      </TouchableOpacity>

      <Toast />
    </ScrollView>
  );
};

export default AddServiceScreen;