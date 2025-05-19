// app/_layout.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, Slot } from 'expo-router';  // Import Slot from expo-router

export default function AppLayout({ }) {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Slot /> 
      </View>
      
      <View >
        <Link href="/Home" >
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  body: { flex: 1, marginTop:1, }, // Adjust marginTop as needed
});
