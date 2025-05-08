import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const AddServiceScreen = ({ navigation }) => {
  const route = useRoute();

  const [serviceData, setServiceData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '', // in minutes
    category: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setServiceData({
      ...serviceData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!serviceData.name || !serviceData.price) {
      Alert.alert('Error', 'Service name and price are required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `https://your-api-domain.com/${businessId}/services`,
        serviceData,
        {
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Service added successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Error adding service:', error);
      Alert.alert('Error', 'Failed to add service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Service</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Haircut, Consultation"
          value={serviceData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Describe the service..."
          multiline
          numberOfLines={4}
          value={serviceData.description}
          onChangeText={(text) => handleInputChange('description', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Price*</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 50.00"
          keyboardType="decimal-pad"
          value={serviceData.price}
          onChangeText={(text) => handleInputChange('price', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 30"
          keyboardType="numeric"
          value={serviceData.duration}
          onChangeText={(text) => handleInputChange('duration', text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Beauty, Health"
          value={serviceData.category}
          onChangeText={(text) => handleInputChange('category', text)}
        />
      </View>

      <Button
        title={isLoading ? 'Adding...' : 'Add Service'}
        onPress={handleSubmit}
        disabled={isLoading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default AddServiceScreen;