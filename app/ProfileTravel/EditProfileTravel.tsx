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

// Interface to match TravelerProfileScreen
interface TravelerData {
  id: string; // Firestore document ID
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  profileImage?: string; // Base64 string starting with 'data:image/'
}

export default function EditProfileTraveler() {
  const router = useRouter();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [travelerData, setTravelerData] = useState<TravelerData>({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    profileImage: '',
  });
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchTravelerData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Error', 'No user logged in');
          router.replace('/traveler/profile');
          return;
        }
        setLoading(true);
        const snap = await getDoc(doc(db, 'Travler', user.uid));
        if (!snap.exists()) {
          Alert.alert('Error', 'Traveler profile not found');
          setTravelerData({ ...travelerData, id: user.uid, email: user.email || '' });
        } else {
          const data = snap.data() as Omit<TravelerData, 'id'>;
          setTravelerData({ id: snap.id, ...data });
          setImageUri(data.profileImage || null);
        }
      } catch (err) {
        console.error('Error fetching traveler data:', err);
        Alert.alert('Error', 'Failed to load traveler data');
      } finally {
        setLoading(false);
      }
    };
    fetchTravelerData();
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
    if (!travelerData.fullName.trim() || !travelerData.email.trim()) {
      return Alert.alert('Error', 'Full Name and Email are required');
    }
    setShowConfirmation(true);
  };

  const handleUpdate = async () => {
    setShowConfirmation(false);
    setUpdating(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not signed in');

      const updatedData: Omit<TravelerData, 'id'> = {
        fullName: travelerData.fullName,
        email: travelerData.email,
        phone: travelerData.phone || '',
        address: travelerData.address || '',
        bio: travelerData.bio || '',
        profileImage: imageUri || '',
      };

      await setDoc(doc(db, 'Travler', user.uid), updatedData, { merge: true });
      Alert.alert('Success', 'Profile updated successfully');
      router.back(); // Return to TravelerProfileScreen
    } catch (err) {
      console.error('Error updating traveler data:', err);
      Alert.alert('Error', 'Failed to update profile');
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
        <TouchableOpacity onPress={() => router.replace('/traveler/profile')}>
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
            accessibilityLabel="Profile Image"
          />
        ) : (
          <Ionicons name="person" size={80} color="#6B7280" />
        )}
        <View style={styles.cameraIcon}>
          <Feather name="camera" size={20} color="white" />
        </View>
      </TouchableOpacity>

      {/* Form Fields */}
      {(['fullName', 'email', 'phone', 'address', 'bio'] as (keyof Omit<TravelerData, 'id' | 'profileImage'>)[]).map(
        (field, i) => (
          <View style={styles.formGroup} key={i}>
            <Text style={styles.label}>
              {field === 'bio' ? 'Bio' : field.charAt(0).toUpperCase() + field.slice(1)}
              {['fullName', 'email'].includes(field) ? '*' : ''}
            </Text>
            <TextInput
              style={[styles.input, field === 'bio' && styles.multilineInput]}
              value={travelerData[field] || ''}
              onChangeText={(text) => setTravelerData({ ...travelerData, [field]: text })}
              placeholder={`Enter ${field}`}
              keyboardType={
                field === 'email' ? 'email-address' : field === 'phone' ? 'phone-pad' : 'default'
              }
              multiline={field === 'bio'}
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