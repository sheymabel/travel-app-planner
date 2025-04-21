import React from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import BusinessTabsLayout from './_layout'; // Import your BusinessTabsLayout component

export default function BusinessOwnerIndex() {
  return (
    <View style={{ flex: 1 }}>
      {/* You can use the Stack component for additional screen transitions if needed */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Render the BusinessTabsLayout to show the tabs */}
      <BusinessTabsLayout />
    </View>
  );
}