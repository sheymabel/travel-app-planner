import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import from expo-router instead
import { db, auth, storage } from '../../../configs/FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const ServiceUploadForm = ({ businessId }: { businessId: string }) => {
  const router = useRouter(); // Use useRouter instead of useNavigation
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const currentUser = auth.currentUser;

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to upload images');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ Compatible et stable
        quality: 0.8,
        allowsMultipleSelection: true,
      });
      
  
      if (!result.canceled && result.assets) {
        const newImages = [...images, ...result.assets.map(asset => asset.uri)];
        setImages(newImages.slice(0, 10)); // ✅ Limit to 10 images
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadImages = async () => {
    const uploadedUrls: string[] = [];
    
    for (const uri of images) {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `services/${businessId}/${Date.now()}_${images.indexOf(uri)}`);
        await uploadBytes(imageRef, blob);
        const imageUrl = await getDownloadURL(imageRef);
        uploadedUrls.push(imageUrl);
      } catch (error) {
        console.error('Image upload error:', error);
        throw new Error('Failed to upload one or more images');
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (!businessId) {
      Alert.alert('Error', 'Business ID is missing');
      return;
    }

    if (!currentUser) {
      Alert.alert('Authentication Error', 'Please login again');
      return;
    }

    if (!name || !description || !price || images.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all fields and add at least one image.');
      return;
    }

    setIsUploading(true);
    
    try {
      const imageUrls = await uploadImages();

      const serviceData = {
        name,
        description,
        price: parseFloat(price),
        duration: '30 minutes',
        category: 'General',
        imageUrls,
        businessId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser.uid
      };

      await addDoc(collection(db, 'business', businessId, 'services'), serviceData);
      
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setImages([]);
      
      Alert.alert('Success', 'Service created successfully!');
      
      // Navigate back using Expo Router
      router.back(); // Goes back to previous screen
      // OR navigate to a specific route
      // router.push('/business/services'); // Adjust to your actual route
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to create service');
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Create New Service</Text>
        </View>

        {/* Form fields remain the same */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Service Name</Text>
          <TextInput
            placeholder="What service are you offering?"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Describe your service in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.multilineInput]}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            placeholder="0.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Photos ({images.length}/10)</Text>
          <TouchableOpacity 
            style={styles.imagePickerButton} 
            onPress={handleImagePicker}
            disabled={images.length >= 10}
          >
            <Ionicons name="camera" size={24} color="#1877F2" />
            <Text style={styles.imagePickerText}>Add Photos</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton} 
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (!name || !description || !price || images.length === 0) && styles.disabledButton
          ]} 
          onPress={handleSubmit}
          disabled={!name || !description || !price || images.length === 0 || isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Publish Service</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Keep your existing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
    paddingBottom: 15,
    marginBottom: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#050505',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#050505',
  },
  input: {
    backgroundColor: '#f0f2f5',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#050505',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 6,
    padding: 12,
    justifyContent: 'center',
  },
  imagePickerText: {
    marginLeft: 10,
    color: '#1877F2',
    fontWeight: '600',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#1877F2',
    borderRadius: 6,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#aac4f3',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ServiceUploadForm;