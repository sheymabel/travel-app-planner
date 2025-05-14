import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native'; // Added TouchableOpacity, Text
import React from 'react';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { router } from 'expo-router';



const { width, height } = Dimensions.get('window');

export default function Login() {
  const navigation = useNavigation(); 

 

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/scre/Screen1')} style={{ width: '100%', height: '100%' }}>
         <Text>
Wellcome Travel 
                       </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the view take the full screen height
    justifyContent: 'center', // Center children vertically
    alignItems: 'center', // Center children horizontally
    backgroundColor: '#FFFFFF', // Optional: Set a background color for the screen
  },
  logo: {
    width: width * 0.5, // Example: Make the logo 50% of the screen width
    height:0, // Set a fixed height or calculate based on aspect ratio
  },
});

