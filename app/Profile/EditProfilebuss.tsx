import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../src/styles/business-owner/EditProfileScreenStyles';

interface BusinessData {
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  category: string;
  fullName: string;
  website: string;
  profileImage?: string;
  createdAt?: any;
  updatedAt?: any;
}

const EditProfilebuss = () => {
  const router = useRouter();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    category: '',
    fullName: '',
    website: ''
  });
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBusinessData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.replace('/auth/sign-in');
          return;
        }

        setLoading(true);
        const businessRef = doc(db, 'business', user.uid);
        const businessSnap = await getDoc(businessRef);

        if (isMounted) {
          if (businessSnap.exists()) {
            const data = businessSnap.data() as BusinessData;
            setBusinessData({
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
              description: data.description || '',
              category: data.category || '',
              fullName: data.fullName || '',
              website: data.website || '',
              profileImage: data.profileImage || ''
            });
            if (data.profileImage) {
              setImage(data.profileImage);
            }
          } else {
            Alert.alert('Error', 'Business profile not found');
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching business data:', error);
          Alert.alert('Error', 'Failed to load business data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBusinessData();

    return () => {
      isMounted = false;
    };
  }, []);

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

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const showSaveConfirmation = () => {
    if (!businessData.name.trim()) {
      Alert.alert('Error', 'Business name is required');
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
        router.replace('/auth/sign-in');
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
      
      if (image) {
        const localUri = image;
        const filename = localUri.split('/').pop() || `profile_${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('profileImage', {
          uri: localUri,
          name: filename,
          type,
        } as any);
      }

      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:5000/business/${user.uid}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update business');
      }

      // Update Firestore with all fields
      await updateDoc(doc(db, 'business', user.uid), {
        name: businessData.name,
        email: businessData.email,
        phone: businessData.phone,
        address: businessData.address,
        description: businessData.description,
        category: businessData.category,
        fullName: businessData.fullName,
        website: businessData.website,
        updatedAt: serverTimestamp(),
        ...(image && { profileImage: image })
      });

      Alert.alert('Success', 'Business profile updated successfully');
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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/business-owner/BusinessProfile')}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Business Profile</Text>
        <TouchableOpacity onPress={showSaveConfirmation} disabled={updating}>
          {updating ? <ActivityIndicator /> : <Text style={styles.saveButton}>Save</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
        <Image
          source={{ uri: image || businessData.profileImage || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View style={styles.cameraIcon}>
          <Feather name="camera" size={20} color="white" />
        </View>
      </TouchableOpacity>

      {/* Reordered form fields */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Owner Name</Text>
        <TextInput
          style={styles.input}
          value={businessData.fullName}
          onChangeText={(text) => setBusinessData({...businessData, fullName: text})}
          placeholder="Owner full name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Business Name*</Text>
        <TextInput
          style={styles.input}
          value={businessData.name}
          onChangeText={(text) => setBusinessData({...businessData, name: text})}
          placeholder="Business name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={businessData.category}
          onChangeText={(text) => setBusinessData({...businessData, category: text})}
          placeholder="Category"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={businessData.description}
          onChangeText={(text) => setBusinessData({...businessData, description: text})}
          placeholder="Description"
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address*</Text>
        <TextInput
          style={styles.input}
          value={businessData.address}
          onChangeText={(text) => setBusinessData({...businessData, address: text})}
          placeholder="Address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone*</Text>
        <TextInput
          style={styles.input}
          value={businessData.phone}
          onChangeText={(text) => setBusinessData({...businessData, phone: text})}
          placeholder="Phone"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email*</Text>
        <TextInput
          style={styles.input}
          value={businessData.email}
          onChangeText={(text) => setBusinessData({...businessData, email: text})}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={businessData.website}
          onChangeText={(text) => setBusinessData({...businessData, website: text})}
          placeholder="Website URL"
          keyboardType="url"
        />
      </View><ScrollView contentContainerStyle={styles.container}>
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
        
        <Text style={{marginBottom: 15, textAlign: 'center'}}>
          Are you sure you want to save these changes?
        </Text>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Pressable 
            style={[styles.modalOption, {borderBottomWidth: 0}]}
            onPress={() => setShowConfirmation(false)}
          >
            <Text style={{color: '#3B82F6'}}>Cancel</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.modalOption, {borderBottomWidth: 0}]}
            onPress={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#3B82F6" />
            ) : (
              <Text style={{color: '#3B82F6', fontWeight: '600'}}>Save Changes</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
</ScrollView>
    </ScrollView>
    
  );
};

export default EditProfilebuss;