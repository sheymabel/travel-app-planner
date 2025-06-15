import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../src/styles/business-owner/editProfilScreenStyles';

// Interface for Business Profile
interface BusinessData {
  id: string; // Firestore document ID
  fullName: string; // Updated from fullName to name
  email: string;
  phone: string;
  businessAddress: string;
  category: string;
  city: string;
  description: string;
  profileImage?: string; // Base64 string starting with 'data:image/'
}

export default function EditProfileBusiness() {
  const router = useRouter();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData>({
    id: '',
    fullName: '', // Updated from previous default
    email: '', // Updated from sheyma@gmail.com
    phone: '', // Matches your input
    businessAddress: '', // Updated from 123 New Street, City
    category: '', // Matches your input
    city: '', // Matches your input
    description: '', // Matches your input
    profileImage: '', // Initialized as empty string (no base64 data yet)
  });
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Error', 'No user logged in');
          router.replace('/business-owner/BusinessProfile');
          return;
        }
        setLoading(true);
        const snap = await getDoc(doc(db, 'business', user.uid));
        if (!snap.exists()) {
          Alert.alert('Error', 'Business profile not found');
          setBusinessData({ ...businessData, id: user.uid, email: user.email || 'hedi@gmail.com' });
        } else {
          const data = snap.data() as Omit<BusinessData, 'id'>;
          setBusinessData({ id: snap.id, ...data });
          setImageUri(data.profileImage || null);
        }
      } catch (err) {
        console.error('Error fetching business data:', err);
        Alert.alert('Error', 'Failed to load business data');
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission required', 'Please allow access to your photos');
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true, // Enable base64 output
    });
    if (!res.canceled && res.assets[0].base64) {
      const base64Image = `data:image/png;base64,${res.assets[0].base64}`;
      setImageUri(base64Image);
    }
  };

  const showSaveConfirmation = () => {
    if (!businessData.fullName.trim() || !businessData.email.trim()) {
      return Alert.alert('Error', 'Name and Email are required');
    }
    setShowConfirmation(true);
  };

  const handleUpdate = async () => {
    setShowConfirmation(false);
    setUpdating(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not signed in');

      const updatedData: Omit<BusinessData, 'id'> = {
        fullName: businessData.fullName,
        email: businessData.email,
        phone: businessData.phone || '',
        businessAddress: businessData.businessAddress || '',
        category: businessData.category || '',
        city: businessData.city || '',
        description: businessData.description || '',
        profileImage: imageUri || '',
      };

      await setDoc(doc(db, 'business', user.uid), updatedData, { merge: true });
      Alert.alert('Success', 'Business profile updated successfully');
      router.back(); // Return to BusinessProfileScreen
    } catch (err) {
      console.error('Error updating business data:', err);
      Alert.alert('Error', 'Failed to update business profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/business-owner/BusinessProfile')}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={showSaveConfirmation} disabled={updating}>
          {updating ? <ActivityIndicator color="white" /> : <Text style={styles.saveButton}>Save</Text>}
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.profileImage}
            resizeMode="cover"
            accessibilityLabel="Business Profile Image"
          />
        ) : (
          <Ionicons name="business" size={80} color="#6B7280" />
        )}
        <View style={styles.cameraIcon}>
          <Feather name="camera" size={20} color="white" />
        </View>
      </TouchableOpacity>

      {/* Form Fields */}
      {(['fullName', 'email', 'phone', 'businessAddress', 'category', 'city', 'description'] as const).map(
        (field) => (
          <View style={styles.formGroup} key={field}>
            <Text style={styles.label}>
              {field === 'businessAddress' ? 'Business Address' : field.charAt(0).toUpperCase() + field.slice(1)}
              {['fullName', 'email'].includes(field) ? '*' : ''}
            </Text>
            <TextInput
              style={[styles.input, field === 'description' && styles.multilineInput]}
              value={businessData[field]}
              onChangeText={(text) => setBusinessData((prev) => ({ ...prev, [field]: text }))} // Functional update
              placeholder={`Enter ${field === 'fullName' ? 'fullName' : field}`}
              keyboardType={
                field === 'email' ? 'email-address' : field === 'phone' ? 'phone-pad' : 'default'
              }
              multiline={field === 'description'}
              accessibilityLabel={field}
            />
          </View>
        )
      )}

      {/* Confirmation Modal */}
      <Modal transparent visible={showConfirmation} onRequestClose={() => setShowConfirmation(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Changes</Text>
            <Text style={styles.modalText}>Are you sure you want to save these changes?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setShowConfirmation(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleUpdate}
                disabled={updating}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}