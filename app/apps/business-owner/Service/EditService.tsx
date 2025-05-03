
import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const EditService = () => {
  const { serviceId } = useLocalSearchParams();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Edit Service</Text>
      <Text>Service ID: {serviceId}</Text>
    </View>
  );
};

export default EditService;