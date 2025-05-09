// app/_layout.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, Slot } from 'expo-router';  // Import Slot from expo-router

export default function AppLayout({ }) {
  return (
    <View style={styles.container}>
    
      {/* Slot renders the current page content based on navigation */}
      <View style={styles.body}>
        <Slot /> {/* Slot will render the current page content */}
      </View>
      
      <View >
        {/* Link to navigate to '/App' */}
        <Link href="/apps/Home" >
        
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  body: { flex: 1, marginTop:1, }, // Adjust marginTop as needed
});
