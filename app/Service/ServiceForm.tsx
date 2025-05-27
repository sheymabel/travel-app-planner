import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../src/styles/business-owner/serviceStyles';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
const categories = ['Utilitarian ', 'Aesthetic', 'Artistic', 'Cultural', 'Traditional'];

export interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  category: string;
   image?: string[];
  businessId: string;
}

interface ServiceFormProps {
  onSubmit: (data: ServiceFormData) => void;
  isSubmitting: boolean;
}

const ServiceForm = ({ onSubmit, isSubmitting }: ServiceFormProps) => {
  const [formData, setFormData] = useState<Omit<ServiceFormData, 'businessId'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: [],
  });

  const [businessId, setBusinessId] = useState<string>('');

  useEffect(() => {
    const fetchBusinessId = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const businessDoc = await getDoc(doc(db, 'businesses', user.uid));
        if (businessDoc.exists()) {
          setBusinessId(user.uid);
        } else {
          Alert.alert('Business not found');
        }
      }
    };
    fetchBusinessId();
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setFormData((prev) => ({
        ...prev,
        image: [...(prev.image || []), result.assets[0].uri],
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    onSubmit({ ...formData, businessId });
  };

  return (
    <View style={styles.formContainer}>
      <TouchableOpacity style={styles.imageUploadContainer} onPress={handleImagePick}>
        {formData.image?.[0] ? (
          <Image source={{ uri: formData.image[0] }} style={styles.imagePreview} />
        ) : (
          <Ionicons name="image-outline" size={40} color="#9CA3AF" />
        )}
        <Text style={styles.imageUploadText}>
          {formData.image?.[0] ? 'Change Image' : 'Upload Image'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.inputLabel}>Service Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter service name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <Text style={styles.inputLabel}>Price</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="0.00"
        value={formData.price.toString()}
        onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) })}
      />

    <Text style={styles.inputLabel}>Category</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={formData.category}
    onValueChange={(itemValue) =>
      setFormData({ ...formData, category: itemValue })
    }
    style={styles.picker}
  >
    <Picker.Item label="Select a category" value="" />
    {categories.map((cat) => (
      <Picker.Item key={cat} label={cat} value={cat} />
    ))}
  </Picker>
</View>


  
      <Text style={styles.inputLabel}>Description</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Describe your service..."
        multiline
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
      />

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
    </View>
  );
};

export default ServiceForm;
