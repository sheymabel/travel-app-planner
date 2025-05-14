import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
  Pressable
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../src/styles/business-owner/sharedStyles';
export default function BusinessServicesScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<(string | File)[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isFetchingBusiness, setIsFetchingBusiness] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const isWeb = Platform.OS === 'web';
  const auth = getAuth();

  useEffect(() => {
    const fetchBusinessId = async () => {
      try {
        setIsFetchingBusiness(true);
        const user = auth.currentUser;
        
        if (!user) {
          setError('Please sign in to create services');
          setBusinessId(null);
          return;
        }

        const businessDocRef = doc(db, 'business', user.uid);
        const businessDoc = await getDoc(businessDocRef);

        if (!businessDoc.exists()) {
          setError('Please create a business profile before adding services');
          setBusinessId(null);
        } else {
          setBusinessId(businessDoc.id);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching business:', err);
        setError('Error loading business information');
        setBusinessId(null);
      } finally {
        setIsFetchingBusiness(false);
      }
    };

    fetchBusinessId();

    if (!isWeb) {
      (async () => {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        await ImagePicker.requestCameraPermissionsAsync();
      })();
    }
  }, []);

  const handleImageSelection = async (useCamera: boolean) => {
    if (!businessId) {
      setError('Create business profile first');
      return;
    }

    if (isWeb) {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';
      input.onchange = async (event: Event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files) {
          const newFiles = Array.from(files);
          const newPreviews = await Promise.all(
            newFiles.map(file =>
              new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
              })
            )
          );
          setImages(prev => [...prev, ...newPreviews]);
          setFilesToUpload(prev => [...prev, ...newFiles]);
        }
      };
      input.click();
      return;
    }

    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            aspect: [4, 3],
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
            aspect: [4, 3],
          });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      setError('Error selecting images');
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);

    if (isWeb) {
      filesToUpload.forEach(file => formData.append('images', file));
    } else {
      images.forEach((uri, index) => {
        formData.append('images', {
          uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
      });
    }

    return formData;
  };

  const confirmSubmit = () => {
    if (!name || !description || !price || images.length === 0) {
      setError('All fields are required');
      return;
    }

    setShowConfirmationModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmationModal(false);
    await handleSubmit();
  };

  const handleSubmit = async () => {
    if (!businessId) {
      setError('Business profile required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = auth.currentUser;
      
      if (!user) throw new Error('Authentication required');

      const token = await user.getIdToken();
      const formData = createFormData();

      const response = await axios.post(
        `http://localhost:5000/api/business/${businessId}/services`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.status === 201) {
        Alert.alert(
          'Success', 
          'Service published successfully!',
          [{ text: 'OK', onPress: () => {
            setName('');
            setDescription('');
            setPrice('');
            setImages([]);
            setFilesToUpload([]);
            setShowForm(false);
          }}]
        );
      }
    } catch (err: any) {
      console.error('Publication failed:', err);
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to publish service',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (isWeb) {
      setFilesToUpload(prev => prev.filter((_, i) => i !== index));
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setName('');
      setDescription('');
      setPrice('');
      setImages([]);
      setFilesToUpload([]);
      setError(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {isFetchingBusiness ? (
          <Text style={styles.loadingText}>Loading business information...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : businessId ? (
          <>
            {!showForm ? (
              <View style={styles.header}>
                <Text style={styles.headerText}>My Services</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={toggleForm}
                >
                  <Text style={styles.addButtonText}>+ Add Service</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.header}>
                  <Text style={styles.headerText}>Create New Service</Text>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={toggleForm}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Service Photos*</Text>
                  <View style={styles.imagePreviewContainer}>
                    {images.map((imageUri, index) => (
                      <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri: imageUri.toString() }} style={styles.previewImage} />
                        <TouchableOpacity 
                          style={styles.removeButton} 
                          onPress={() => removeImage(index)}
                        >
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  <View style={styles.buttonGroup}>
                    {!isWeb && (
                      <TouchableOpacity
                        style={styles.imageButton}
                        onPress={() => handleImageSelection(true)}
                      >
                        <Text style={styles.buttonText}>📸 Take Photo</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.imageButton}
                      onPress={() => handleImageSelection(false)}
                    >
                      <Text style={styles.buttonText}>
                        {isWeb ? '📁 Upload Files' : '🖼️ Choose Photos'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Service Name*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter service name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Description*</Text>
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Describe your service..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Price*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter price"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.disabledButton]}
                  onPress={confirmSubmit}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Publishing...' : 'Publish Service'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </>
        ) : (
          <Text style={styles.errorText}>
            Please create a business profile first to add services
          </Text>
        )}
      </View>

      {showConfirmationModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Service Publication</Text>
            
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Service Details</Text>
              <Text>Name: {name}</Text>
              <Text>Price: ${price}</Text>
              <Text>Description: {description}</Text>
              <Text>Images: {images.length} selected</Text>
            </View>

            <Pressable
              style={styles.modalOption}
              onPress={handleConfirm}
            >
              <Text style={{color: '#3B82F6'}}>Confirm Publication</Text>
              <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
            </Pressable>

            <Pressable
              style={styles.modalOption}
              onPress={() => setShowConfirmationModal(false)}
            >
              <Text style={{color: '#EF4444'}}>Cancel</Text>
              <Ionicons name="close-circle" size={20} color="#EF4444" />
            </Pressable>

            <Pressable
              style={styles.modalClose}
              onPress={() => setShowConfirmationModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

