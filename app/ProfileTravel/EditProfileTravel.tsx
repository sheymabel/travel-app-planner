import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, 
  Alert, ScrollView, Modal, Pressable 
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../src/styles/business-owner/EditProfileScreenStyles';

interface TravelerData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  profileImage?: string;
  profileImages?: string[];
}

export default function EditProfileTraveler() {
  const router = useRouter();
  const auth = getAuth();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [travelerData, setTravelerData] = useState<TravelerData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    profileImage: '',
    profileImages: []
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchTravelerData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.replace('/traveler/profile');
          return;
        }
        setLoading(true);
        const travelerRef = doc(db, 'Travler', user.uid);
        const travelerSnap = await getDoc(travelerRef);
        if (travelerSnap.exists()) {
          const data = travelerSnap.data() as TravelerData;
          setTravelerData({
            fullName: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            bio: data.bio || '',
            profileImage: data.profileImage || '',
            profileImages: data.profileImages || []
          });
          if (data.profileImages?.length) {
            setImageUri(data.profileImages[0]);
          } else if (data.profileImage) {
            setImageUri(data.profileImage);
          }
        } else {
          Alert.alert('Error', 'Traveler profile not found');
        }
      } catch (error) {
        console.error('Error fetching traveler data:', error);
        Alert.alert('Error', 'Failed to load traveler data');
      } finally {
        setLoading(false);
      }
    };

    fetchTravelerData();
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSource = () => {
    if (imageError) {
      return require('../../assets/images/favicon.png');
    }
    if (imageUri) {
      return { uri: imageUri };
    }
    if (travelerData.profileImages?.length) {
      return { uri: travelerData.profileImages[0] };
    }
    if (travelerData.profileImage) {
      return { uri: travelerData.profileImage };
    }
    return require('../../assets/images/favicon.png');
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your photos');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
        setImageError(false);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const showSaveConfirmation = () => {
    if (!travelerData.fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }
    if (!travelerData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    setShowConfirmation(true);
  };

  const handleUpdate = async () => {
    setShowConfirmation(false);
    setUpdating(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        router.replace('/traveler/profile');
        return;
      }

      // Prepare data to save
      const dataToSave: TravelerData = {
        ...travelerData,
        profileImages: imageUri ? [imageUri] : travelerData.profileImages,
        profileImage: imageUri || travelerData.profileImage || '',
      };

      // Save data to Firestore (merge true to update existing fields)
      await setDoc(doc(db, 'Travler', user.uid), dataToSave, { merge: true });

      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Update error:', error);
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
          <Ionicons name="arrow-back" size={24} color="#99B6E0FF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={showSaveConfirmation} disabled={updating}>
          {updating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButton}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
        <Image
          source={getImageSource()}
          style={styles.profileImage}
          onError={handleImageError}
          resizeMode="cover"
        />
        <View style={styles.cameraIcon}>
          <Feather name="camera" size={20} color="white" />
        </View>
      </TouchableOpacity>

      {/* Form Fields */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name*</Text>
        <TextInput
          style={styles.input}
          value={travelerData.fullName}
          onChangeText={(text) => setTravelerData({ ...travelerData, fullName: text })}
          placeholder="Full name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email*</Text>
        <TextInput
          style={styles.input}
          value={travelerData.email}
          onChangeText={(text) => setTravelerData({ ...travelerData, email: text })}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={travelerData.phone}
          onChangeText={(text) => setTravelerData({ ...travelerData, phone: text })}
          placeholder="Phone"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={travelerData.address}
          onChangeText={(text) => setTravelerData({ ...travelerData, address: text })}
          placeholder="Address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={travelerData.bio}
          onChangeText={(text) => setTravelerData({ ...travelerData, bio: text })}
          placeholder="Tell us about yourself"
          multiline
        />
      </View>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Changes</Text>
            <Text style={styles.modalText}>Are you sure you want to save these changes?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButton}
                onPress={() => setShowConfirmation(false)}
              >
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
