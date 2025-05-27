import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../src/styles/business-owner/EditProfileScreenStyles';

interface businessData {
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  category: string;
  fullName: string;
  website: string;
  profileImage?: string;
  profileImages?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export default function  EditProfilebuss () {
  const router = useRouter();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [businessData, setbusinessData] = useState<businessData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    category: '',
    fullName: '',
    website: ''
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchbusinessData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.replace('/business-owner/BusinessProfile');
          return;
        }

        setLoading(true);
        const businessRef = doc(db, 'business', user.uid);
        const businessSnap = await getDoc(businessRef);

        if (businessSnap.exists()) {
          const data = businessSnap.data() as businessData;
          setbusinessData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            description: data.description || '',
            category: data.category || '',
            fullName: data.fullName || '',
            website: data.website || '',
            profileImage: data.profileImage || '',
            profileImages: data.profileImages || []
          });
          // Set the first image if available
          if (data.profileImages?.length) {
            setImageUri(data.profileImages[0]);
          } else if (data.profileImage) {
            setImageUri(data.profileImage);
          }
        } else {
          Alert.alert('Error', 'business profile not found');
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
        Alert.alert('Error', 'Failed to load business data');
      } finally {
        setLoading(false);
      }
    };

    fetchbusinessData();
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSource = () => {
    if (imageError) {
      return require('../../assets/images/tunis.png');
    }
    if (imageUri) {
      return { uri: imageUri };
    }
    if (businessData.profileImages?.length) {
      return { uri: businessData.profileImages[0] };
    }
    if (businessData.profileImage) {
      return { uri: businessData.profileImage };
    }
    return require('../../assets/images/tunis.png');
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
        aspect: [4, 3],
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
    if (!businessData.name.trim()) {
      Alert.alert('Error', 'business name is required');
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
        router.replace('/business-owner/BusinessProfile');
        return;
      }

      const formData = new FormData();
      formData.append('name', businessData.name);
      formData.append('email', businessData.email);
      formData.append('phone', businessData.phone);
      formData.append('address', businessData.address);
      formData.append('description', businessData.description);
      formData.append('category', businessData.category);
      formData.append('fullName', businessData.fullName);
      formData.append('website', businessData.website);
      
      if (imageUri) {
        const imagesArray = [imageUri];
        formData.append('profileImages', JSON.stringify(imagesArray));
      }

      const response = await fetch(`http://localhost:5000/business/${user.uid}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update business');
      }

      const responseData = await response.json();

      if (responseData.message === 'business profile updated successfully') {
        Alert.alert('Success', 'business profile updated successfully');
        router.back();
      } else {
        throw new Error('Failed to update business');
      }
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
        <TouchableOpacity onPress={() => router.replace('/ProfileBuisness/Afficherdata')}>
          <Ionicons name="arrow-back" size={24} color="#292C31FF" />
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
        <Text style={styles.label}>Owner Name</Text>
        <TextInput
          style={styles.input}
          value={businessData.fullName}
          onChangeText={(text) => setbusinessData({...businessData, fullName: text})}
          placeholder="Owner full name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>business Name*</Text>
        <TextInput
          style={styles.input}
          value={businessData.name}
          onChangeText={(text) => setbusinessData({...businessData, name: text})}
          placeholder="business name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={businessData.category}
          onChangeText={(text) => setbusinessData({...businessData, category: text})}
          placeholder="Category"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={businessData.description}
          onChangeText={(text) => setbusinessData({...businessData, description: text})}
          placeholder="Description"
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address*</Text>
        <TextInput
          style={styles.input}
          value={businessData.address}
          onChangeText={(text) => setbusinessData({...businessData, address: text})}
          placeholder="Address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone*</Text>
        <TextInput
          style={styles.input}
          value={businessData.phone}
          onChangeText={(text) => setbusinessData({...businessData, phone: text})}
          placeholder="Phone"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email*</Text>
        <TextInput
          style={styles.input}
          value={businessData.email}
          onChangeText={(text) => setbusinessData({...businessData, email: text})}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={businessData.website}
          onChangeText={(text) => setbusinessData({...businessData, website: text})}
          placeholder="Website URL"
          keyboardType="url"
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
            <Text style={styles.modalText}>
              Are you sure you want to save these changes?
            </Text>
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
                {updating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.modalButtonPrimaryText}>Save Changes</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

