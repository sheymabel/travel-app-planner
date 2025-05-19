// app/_layout.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router'; // Import Slot from expo-router

export default function AppLayout() {
  return (
    <View style={styles.container}>
      {/* Slot will render the content dynamically based on the current route */}
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // You can customize the background color here
  },
});
